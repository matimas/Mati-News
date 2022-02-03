const axios = require('axios');
const { getDB } = require('../util/database');

const facebook = {
    appID: "769488523462428",
    appSecret: "04117054967547e6f1bbfbbe3b2776e6"
};
const google = {
    appID: "673808119262-ftnfi8bk8jo7r5tc3s5jsu5lhq7qu1or.apps.googleusercontent.com",
    appSecret: "rPQUA5Hcgd-8dQubBBbX_2jt"
};

exports.socketIoConnect = (io) => {
    io.use((socket, next) => {
        socket.user = { userName: 'Guest', picture: './default-guest.jpg' }
        const { token, userId, userName, picture, type } = socket.handshake.query;

        if (type === 'facebook') {
            const facebookTokenValidate =
                `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${facebook.appID}|${facebook.appSecret}`
            axios.get(facebookTokenValidate)
                .then(response => {
                    const { app_id, user_id, is_valid } = response.data.data;
                    if (app_id === facebook.appID && user_id === userId && is_valid === true)
                        socket.user = { userName, picture }
                })
        }
        if (type === 'google') {
            const googleTokenValidate =
                `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
            axios.get(googleTokenValidate)
                .then(response => {
                    const { issued_to, user_id, verified_email } = response.data;
                    if (issued_to === google.appID && user_id === userId && verified_email === true)
                        socket.user = { userName, picture }
                })
        }
        next();
    });
    io.on('connection', (socket) => {
        socket.on('Leave the room', room => {
            socket.leave(room)
        });
        socket.on('join the room', room => {
            socket.join(room)
            getDB().collection('comments')
                .find({ 'room': room })
                .toArray()
                .then(comments => {
                    socket.emit('receive previous comments', { room, comments });
                })
        });
        socket.on('Send a comment', (sendedComment) => {
            const comment = { ...sendedComment, ...socket.user }
            getDB().collection('comments')
                .insertOne(comment)
            io.sockets.to(comment.room).emit('Receive a comment', comment);
        });
    });
}
