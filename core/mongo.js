"use strict";

const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = Promise;

exports.connect = function(){
    return new Promise((res, rej) => {
        mongoose.connect(config.mongo, (err, db) => {
            if (err){
                return rej(err);
            } else {
                console.log('Connected to Mongo Database');
                return res(db);
            }
        });
    });
}
