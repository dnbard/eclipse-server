'use strict';

const mongoose = require('mongoose');
const configs = require('../configs');

const MONGO_URL = configs.get('mongo.url');

mongoose.Promise = Promise;

exports.connect = function() {
    if (mongoose.connection.readyState === 1){
        return Promise.resolve(mongoose.connection);
    }

    return new Promise((res, rej) => {
        mongoose.connect(MONGO_URL, (err, db) => {
            if (err){
                return rej(err);
            } else {
                console.log('Connected to Mongo Database');
                return res(db);
            }
        });
    });
}
