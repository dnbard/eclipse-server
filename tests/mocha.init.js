const mongodb = require('mongodb');
const _ = require('lodash');

const COLLECTIONS = require('../enums/collections');
const config = require('../config');

module.exports = function(cb){
    const MongoClient = mongodb.MongoClient;
    const url = config.mongoTest;

    MongoClient.connect(url, {}, function(err, db) {
        if (err){
            return console.error(err);
        }

        Promise.all(_.map(COLLECTIONS, (c) => {
            return new Promise(r => {
                db.collection(c).remove({}, (err, erased) => {
                    console.log(`Collection "${c}" cleaned.`);
                    r();
                });
            });
        })).then(() => {
            const mongo = require('../core/mongo');
            mongo.setDatabase(db);

            console.log('Test DB Connected');

            cb(db);
        });
    });
}
