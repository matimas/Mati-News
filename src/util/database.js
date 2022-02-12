const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const PASSWORD = process.env.PASS;
const uri = `mongodb+srv://matimas:${PASSWORD}@cluster0.yx1p2.mongodb.net/test?retryWrites=true&w=majority`;
let db;

exports.mongoDBconnect = () => {
	mongoClient
		.connect(uri, { useUnifiedTopology: true })
		.then((client) => {
			db = client.db();
		})
		.catch((err) => {
			throw err;
		});
};

exports.getDB = () => db;
