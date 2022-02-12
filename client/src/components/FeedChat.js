import React, { useState, useEffect, useContext, useRef } from 'react';
import {
	makeStyles,
	TextField,
	InputAdornment,
	Button,
	Avatar,
} from '@material-ui/core';
import Comments from './FeedChatComments';
import socketContext from '../context/socketContext';

function FeedChat(props) {
	const [chatComments, setChatComments] = useState([]);
	const [userComment, setUserComment] = useState('');
	const socket = useContext(socketContext);
	const feedChatDisplayRef = useRef(null);
	const { chatRoom } = props;

	const classes = makeStyles({
		feedChatDisplay: {
			height: 150,
			width: '100%',
			border: '1px solid rgb(182, 181, 181)',
			borderRadius: 5,
			overflow: 'auto',
		},
		avatar: {
			marginRight: 10,
		},
	})();

	useEffect(() => {
		socket.emit('join the room', chatRoom);
		socket.on('receive previous comments', receivePreviousCommentsHandler);
		return () => {
			socket.emit('Leave the room', chatRoom);
			socket.removeListener(
				'receive previous comments',
				receivePreviousCommentsHandler,
			);
		};
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		scrollBottomFeedChatDisplay();
		socket.on('Receive a comment', receiveCommentHandler);
		return () =>
			socket.removeListener('Receive a comment', receiveCommentHandler);
		// eslint-disable-next-line
	}, [chatComments]);

	const receivePreviousCommentsHandler = ({ room, comments }) => {
		if (chatRoom !== room) return;
		setChatComments(comments);
		props.setAmountOfCommentsNow(comments.length);
	};

	const receiveCommentHandler = (comment) => {
		if (chatRoom !== comment.room) return;
		let updatedChatComments = [...chatComments];
		updatedChatComments.push(comment);
		setChatComments(updatedChatComments);
	};

	const onSendCommentHandler = () => {
		if (userComment === '') return;
		const comment = {
			text: userComment,
			room: chatRoom,
			createdAt: new Date(),
		};
		socket.emit('Send a comment', comment);
		setUserComment('');
		props.setShowFeedChat(false);
	};

	const onChangeTextHandler = (event) => {
		setUserComment(event.target.value);
	};

	const scrollBottomFeedChatDisplay = () => {
		feedChatDisplayRef.current.scrollTop =
			feedChatDisplayRef.current.scrollHeight;
	};

	return (
		<div className='feed-chat'>
			<div className={classes.feedChatDisplay} ref={feedChatDisplayRef}>
				<Comments chatComments={chatComments} />
			</div>
			<TextField
				fullWidth
				label='Write a comment...'
				variant='outlined'
				margin='normal'
				value={userComment}
				onChange={onChangeTextHandler}
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<Avatar
								src={props.userPicture || './default-guest.jpg'}
								className={classes.avatar}
							/>
						</InputAdornment>
					),
					endAdornment: (
						<Button
							size='small'
							color='primary'
							variant='contained'
							onClick={onSendCommentHandler}
						>
							Send
						</Button>
					),
				}}
			/>
		</div>
	);
}

export default FeedChat;
