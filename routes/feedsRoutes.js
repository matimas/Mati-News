const express = require('express');
const router = express.Router();
const feedsController = require('../controllers/feedsController');
const { getAllFeeds } = feedsController;

router.get('/', getAllFeeds);

module.exports = router;
