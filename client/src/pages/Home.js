import React, { useState, useEffect, useContext } from 'react';
import feedsApi from '../Api/feedsApi';
import InfiniteScroll from 'react-infinite-scroll-component';
import { makeStyles, useMediaQuery, LinearProgress } from '@material-ui/core';
import { authenticationContext } from '../context/authenticationContext';

import { NavBar, Login, Feed } from '../components';

const initializeState = {
	category: 'General',
	country: 'il',
	page: 1,
};

function MainApp() {
	const [feedsConfig, setFeedsConfig] = useState(initializeState);
	const [dataFeeds, setDataFeeds] = useState([]);
	const [isLoading, SetIsLoading] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const { updateUserAuth, setAutoLogout, logout } = useContext(
		authenticationContext,
	);
	const { category, country, page } = feedsConfig;
	const tabletMQ = useMediaQuery('(max-width:1000px)');
	const classes = makeStyles({
		main: {
			// backgroundColor: '#333',
		},
		feeds: {
			display: 'flex',
			flexDirection: 'column',
			padding: tabletMQ ? '80px 0px 0px 0px' : '80px 0px 0px 255px',
			alignItems: 'center',
		},
		linearProgress: {
			position: 'sticky',
			top: 60,
			zIndex: 1,
		},
	})();

	useEffect(() => {
		checkUserAuthentication();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		SetIsLoading(true);

		feedsApi
			.get('/feeds', { params: feedsConfig })
			.then((newFeeds) => {
				console.log(newFeeds);
				page > 1
					? setDataFeeds(dataFeeds.concat(newFeeds.data))
					: setDataFeeds(newFeeds.data);
				SetIsLoading(false);
			})
			.catch((err) => {
				SetIsLoading(false);
			});
		// eslint-disable-next-line
	}, [category, country, page]);

	const onChangeCategoryConfig = (value) => {
		window.scroll({ top: 0, behavior: 'auto' });
		setFeedsConfig({ ...feedsConfig, page: 1, category: value });
	};

	const onChangeCountryConfig = (value) => {
		window.scroll({ top: 0, behavior: 'auto' });
		setFeedsConfig({ ...feedsConfig, page: 1, country: value });
	};

	const onChangePageConfig = (value) => {
		setFeedsConfig({ ...feedsConfig, page: value });
	};

	const checkUserAuthentication = () => {
		const userName = localStorage.getItem('userName');
		const picture = localStorage.getItem('picture');
		const expiryDate = localStorage.getItem('expiryDate') * 1.5;
		console.log('====================================');
		console.log(expiryDate);
		console.log(Date.now());
		console.log('====================================');
		if (!userName) return;

		if (expiryDate < Date.now()) logout();

		const autoLogoutTimer = expiryDate - Date.now();
		setAutoLogout(autoLogoutTimer);
		updateUserAuth({ userName, picture });
	};

	const Feeds = () => (
		<div className={classes.feeds}>
			{dataFeeds.map((feed) =>
				feed.urlToImage ? <Feed dataFeed={feed} key={feed.url} /> : null,
			)}
		</div>
	);
	return (
		<div className={classes.main}>
			{isLoading ? <LinearProgress className={classes.linearProgress} /> : null}
			<NavBar
				onChangeCountryConfig={onChangeCountryConfig}
				onChangeCategoryConfig={onChangeCategoryConfig}
				setShowLoginModal={setShowLoginModal}
			/>
			<Login
				showLoginModal={showLoginModal}
				setShowLoginModal={setShowLoginModal}
			/>
			<InfiniteScroll
				dataLength={dataFeeds.length}
				next={() => onChangePageConfig(page + 1)}
				hasMore={true}
			>
				<Feeds />
			</InfiniteScroll>
		</div>
	);
}

export default MainApp;
