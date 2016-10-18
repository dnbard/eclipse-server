const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const config = require('../config');
const url = config.mongoTest;

MongoClient.connect(url, {}, function(err, db) {
    if (err){
        return console.error(err);
    }

    const mongo = require('../core/mongo');
    mongo.setDatabase(db);

    console.log('Test DB Connected');
});
