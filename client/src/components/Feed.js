import React, { useState } from 'react';
import {
	makeStyles,
	useMediaQuery,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	CardActions,
	Typography,
	IconButton,
	Collapse,
	Badge,
} from '@material-ui/core';
import { Share, Message } from '@material-ui/icons';
import {
	FacebookShareButton,
	WhatsappShareButton,
	TelegramShareButton,
	TwitterShareButton,
} from 'react-share';
import {
	FacebookIcon,
	TwitterIcon,
	TelegramIcon,
	WhatsappIcon,
} from 'react-share';
import FeedChat from './FeedChat';

function Feed(props) {
	const {
		title,
		description,
		publishedAt,
		url,
		urlToImage,
		source,
		amountOfComments,
	} = props.dataFeed;
	const [showFeedChat, setShowFeedChat] = useState(false);
	const [showShareButtons, setShowShareButtons] = useState(false);
	const tabletMQ = useMediaQuery('(max-width:1000px)');
	const phoneMQ = useMediaQuery('(max-width:550px)');
	const classes = makeStyles({
		card: {
			width: phoneMQ ? '100%' : tabletMQ ? '70vw' : '45vw',
			marginBottom: 50,
			boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
		},
		media: {
			height: phoneMQ ? '70vw' : tabletMQ ? '45vw' : '45vw',
			objectFit: 'fill',
		},
		shareButtons: {
			display: 'flex',
		},
		shareButton: {
			cursor: 'pointer',
			outline: 'none',
			'&:hover': { opacity: '0.6' },
		},
	})();

	const sourceSiteNavigation = () => {
		window.open(url);
	};

	const ShareButtons = () => (
		<div className={classes.shareButtons}>
			<FacebookShareButton url={url} className={classes.shareButton}>
				<FacebookIcon round={true} size={36} />
			</FacebookShareButton>
			<WhatsappShareButton url={url} className={classes.shareButton}>
				<WhatsappIcon round={true} size={36} />
			</WhatsappShareButton>
			<TelegramShareButton url={url} className={classes.shareButton}>
				<TelegramIcon round={true} size={36} />
			</TelegramShareButton>
			<TwitterShareButton url={url} className={classes.shareButton}>
				<TwitterIcon round={true} size={36} />
			</TwitterShareButton>
		</div>
	);

	return (
		<Card className={classes.card}>
			<CardActionArea onClick={sourceSiteNavigation}>
				<CardMedia
					className={classes.media}
					image={urlToImage}
					title={title}
					component='img'
				/>
				<CardContent>
					<Typography variant='body1'>{source.name.split('.')[0]}</Typography>
					<Typography variant='h5'>{title}</Typography>
					<Typography variant='body2'>
						{new Date(publishedAt).toLocaleString()}
					</Typography>
					<Typography variant='body1' color='textSecondary'>
						{description}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<IconButton onClick={() => setShowShareButtons(!showShareButtons)}>
					<Share />
				</IconButton>
				<IconButton onClick={() => setShowFeedChat(!showFeedChat)}>
					<Badge color='primary' badgeContent={amountOfComments}>
						<Message />
					</Badge>
				</IconButton>
			</CardActions>
			<Collapse in={showShareButtons} timeout='auto' unmountOnExit>
				<CardContent>
					<ShareButtons />
				</CardContent>
			</Collapse>
			<Collapse in={showFeedChat} timeout='auto' unmountOnExit>
				<CardContent>
					<FeedChat chatRoom={url} />
				</CardContent>
			</Collapse>
		</Card>
	);
}

export default Feed;
