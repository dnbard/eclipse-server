'use strict';

process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.Promise = Promise;
const configs = require('../configs');

const MONGO_URL = configs.get('mongo.url');

var _connection = null;

module.exports = function(cb){
    var action = Promise.resolve();

    if (_connection){
        action = mongoose.disconnect();
    }

    action.then(() => {
            mongoose.connect(MONGO_URL, function(err) {
            if (err){
                return console.error(err);
            }
            console.log(`Connected to "${MONGO_URL}"`);

            _connection = mongoose.connection;

            mongoose.connection.db.dropDatabase();
            console.log(`"${MONGO_URL}" database droped`);

            cb(_connection);
        });
    });
}
