import React from 'react';
import {
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Avatar,
} from '@material-ui/core';

const Comments = ({ chatComments }) => (
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

export default Comments;
