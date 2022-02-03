const { newsapi } = require('../util/newsapi');
const { getDB } = require('../util//database');

const getAllFeeds = async (req, res, next) => {
	const { category, country, page } = req.query;
	const feedConfig = { category, country, page, pageSize: 10 };
	let { articles: feeds } = await newsapi.v2.topHeadlines(feedConfig);
	await getFeedsAmountOfComments(feeds);
	console.log(feeds);
	res.send(feeds);
};

const getFeedsAmountOfComments = (feeds) => {
	return Promise.all(
		feeds.map(async (feed) => {
			let comments = await getDB()
				.collection('comments')
				.find({ room: feed.url })
				.toArray();
			feed.amountOfComments = comments.length;
		}),
	);
};

module.exports = { getAllFeeds };
