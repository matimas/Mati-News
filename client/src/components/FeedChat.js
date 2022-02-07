import React, { useState, useEffect, useContext, useRef } from 'react';
import {
	makeStyles,
	List,
	ListItem,
	TextField,
	ListItemText,
	ListItemAvatar,
	InputAdornment,
	Button,
	Avatar,
} from '@material-ui/core';
import socketContext from '../context/socketContext';
import { authenticationContext } from '../context/authenticationContext';

function FeedChat(props) {
	const [chatComments, setChatComments] = useState([]);
	const [userComment, setUserComment] = useState('');
	const socket = useContext(socketContext);
	const { picture } = useContext(authenticationContext);
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
	}, []);

	const receivePreviousCommentsHandler = ({ room, comments }) => {
		if (chatRoom !== room) return;
		setChatComments(comments);
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
	};

	const onChangeTextHandler = (event) => {
		setUserComment(event.target.value);
	};

	const scrollBottomFeedChatDisplay = () => {
		feedChatDisplayRef.current.scrollTop =
			feedChatDisplayRef.current.scrollHeight;
	};
	const Comments = () => (
		<List>
			{chatComments.map((comment, ind) => (
				<ListItem key={ind}>
					<ListItemAvatar>
						<Avatar src={comment.picture} />
					</ListItemAvatar>
					<ListItemText
						primary={comment.text}
						secondary={
							comment.userName +
							', ' +
							new Date(comment.createdAt).toLocaleString()
						}
					/>
				</ListItem>
			))}
		</List>
	);

	return (
		<div className='feed-chat'>
			<div className={classes.feedChatDisplay} ref={feedChatDisplayRef}>
				<Comments />
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
						<InputAdornment>
							<Avatar
								src={picture || './default-guest.jpg'}
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
