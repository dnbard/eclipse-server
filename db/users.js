'use strict';

const uuid = require('node-uuid').v4;
const mongoose = require('mongoose');
const Base64 = require('js-base64').Base64;
const CryptoJS = require('crypto-js');

const logger = require('../core/logger').child({widget_type: 'dbUsers'});
const configs = require('../configs');
const Token = require('../db/tokens');
const stringRegex = /[0-9a-zA-Z]+/;

const DEFAULT_STAGE_ID = configs.get('stage.default');
const SECRET_KEY = configs.get('secret');

const schema = mongoose.Schema({
    _id: { type: String, unique: true, default: uuid },
    login: { type: String, unique: true, match: stringRegex, index: true },
    salt: { type: String, required: true },
    password: { type: String, required: true },
    stageId: { type: String, default: DEFAULT_STAGE_ID },
    credits: { type: Number, default: 1000 },
    pvp: { type: Number, default: 0, index: true },
    shipId: String
});

schema.statics.createOne = function(data){
    data = data || {};

    if (typeof data.password !== 'string' || data.password.length < 7){
        return Promise.reject('Password empty or too small');
    }

    if (!stringRegex.test(data.password)){
        return Promise.reject('Password contain invalid characters');
    }

    const salt = Base64.encode(Math.random());
    const user = new User({
        login: data.login,
        salt: salt,
        password: CryptoJS.SHA256(data.password + salt + SECRET_KEY)
    });

    return user.save().then(user => {
        logger.info(`User(id="${user.id}") created`);

        const token = new Token({
            userId: user._id
        });

        return token.save().then(t => {
            logger.info(`Token(id="${t.id}") for user(id="${user.id}") created`);
            return {
                login: user.login,
                token: t.token,
                _id: user._id
            };
        });
    });
}

const User = mongoose.models.users || mongoose.model('users', schema);

module.exports = User;
