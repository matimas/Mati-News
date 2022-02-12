import React from 'react';
import {
	FacebookShareButton,
	WhatsappShareButton,
	TelegramShareButton,
	TwitterShareButton,
	FacebookIcon,
	TwitterIcon,
	TelegramIcon,
	WhatsappIcon,
} from 'react-share';

const ShareButtons = ({ url, classes }) => (
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

export default ShareButtons;
