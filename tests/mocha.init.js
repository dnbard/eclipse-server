const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.Promise = Promise;

const COLLECTIONS = require('../enums/collections');
const config = require('../config');

module.exports = function(cb){
    const url = config.mongoTest;

    mongoose.connect(url, function(err) {
        if (err){
            return console.error(err);
        }
        console.log('Connected to "eclipse-test"');

        mongoose.connection.db.dropDatabase();
        console.log('"eclipse-test" database droped');

        cb(mongoose.connection);
    });
}
