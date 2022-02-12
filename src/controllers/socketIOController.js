const axios = require('axios');
const { getDB } = require('../util/database');

const facebook = {
	appID: '457454052520785',
	appSecret: 'c46f56e3c782affa970d000f43234573',
};
const google = {
	appID:
		'159757706926-o9afbfuq9mal3kb1pfi4rnqbg681u4od.apps.googleusercontent.com',
	appSecret: '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',
};

exports.socketIoConnect = (io) => {
	io.use((socket, next) => {
		socket.user = { userName: 'Guest', picture: './default-guest.jpg' };
		const { token, userId, userName, picture, type } = socket.handshake.query;

		if (!type) return;

		if (type === 'facebook') {
			const facebookTokenValidate = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${facebook.appID}|${facebook.appSecret}`;
			axios.get(facebookTokenValidate).then((response) => {
				const { app_id, user_id, is_valid } = response.data.data;
				if (
					app_id === facebook.appID &&
					user_id === userId &&
					is_valid === true
				)
					socket.user = { userName, picture };
			});
		}
		if (type === 'google') {
			const googleTokenValidate = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`;
			axios.get(googleTokenValidate).then((response) => {
				const { issued_to, user_id, verified_email } = response.data;
				if (
					issued_to === google.appID &&
					user_id === userId &&
					verified_email === true
				)
					socket.user = { userName, picture };
			});
		}
		next();
	});
	io.on('connection', (socket) => {
		socket.on('Leave the room', (room) => {
			socket.leave(room);
		});
		socket.on('join the room', (room) => {
			socket.join(room);
			getDB()
				.collection('comments')
				.find({ room: room })
				.toArray()
				.then((comments) => {
					socket.emit('receive previous comments', { room, comments });
				});
		});
		socket.on('Send a comment', (sendedComment) => {
			const comment = { ...sendedComment, ...socket.user };
			getDB().collection('comments').insertOne(comment);
			io.sockets.to(comment.room).emit('Receive a comment', comment);
		});
	});
};
