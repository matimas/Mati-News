const mongoClient = require('mongodb').MongoClient;

const uri =
	'mongodb+srv://matimas:mati3044@cluster0.yx1p2.mongodb.net/test?retryWrites=true&w=majority';
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
