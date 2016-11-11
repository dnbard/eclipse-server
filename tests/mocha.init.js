process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.Promise = Promise;
const config = require('../config');

var _connection = null;

module.exports = function(cb){
    const url = config.mongoTest;

    var action = Promise.resolve();

    if (_connection){
        action = mongoose.disconnect();
    }

    action.then(() => {
            mongoose.connect(url, function(err) {
            if (err){
                return console.error(err);
            }
            console.log('Connected to "eclipse-test"');

            _connection = mongoose.connection;

            mongoose.connection.db.dropDatabase();
            console.log('"eclipse-test" database droped');

            cb(_connection);
        });
    });
}
