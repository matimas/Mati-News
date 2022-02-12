const http = require('http');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const socket_io = require('socket.io');
const path = require('path');
const app = express();
const server = http.Server(app);
// const io = socket_io(server);
const io = socket_io(server, {
	cors: {
		origin: '/',
		methods: ['GET'],
		transports: ['polling', 'websocket'],
		credentials: true,
	},
	allowEIO3: true,
});
const feedsRoutes = require('./routes/feedsRoutes');
const { mongoDBconnect } = require('./util/database');
const { socketIoConnect } = require('./controllers/socketIOController');
const { errorHandler } = require('./middlewares/errorHandler');

app.use(express.static(path.join(__dirname, '../client/build')));

app.use(cors());

app.use(express.json());

app.use('/api/feeds', feedsRoutes);

app.use(errorHandler);

socketIoConnect(io);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
	console.log('Server running on :' + PORT);
});
mongoDBconnect(() => {});
