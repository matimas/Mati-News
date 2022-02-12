import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
	main: {
		// backgroundColor: '#333',
	},
	fev: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	linearProgress: {
		position: 'sticky',
		top: 60,
		zIndex: 1,
	},
});
const UserFavorites = () => {
	const [userName, setUserName] = useState('');
	useEffect(() => {
		console.log(localStorage.getItem('userName'));
		setUserName(localStorage.getItem('userName'));
	}, []);

	const classes = useStyles();
	return (
		<div className={classes.fev}>
			<h1>Welcome back {userName}</h1>
			<h2>User Favorites List</h2>
		</div>
	);
};

export default UserFavorites;
