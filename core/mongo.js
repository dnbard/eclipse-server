"use strict";

const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

let _db = null;

exports.connect = function(){
    return new Promise((res, rej) => {
        MongoClient.connect(config.mongo, function(err, db) {
            if (err){
                return rej(err);
            } else {
                console.log('Connected to Mongo Database');
                _db = db;
                return res(db);
            }
        });
    });
}

exports.getDatabase = function(){
    return _db;
}

exports.setDatabase = function(db){
    _db = db;
}

exports.closeConnection = function(){
    // _db.close();
    _db = null;
}
