const uuid = require('node-uuid').v4;
const mongoose = require('mongoose');
const Base64 = require('js-base64').Base64;
const CryptoJS = require("crypto-js");

const config = require('../config');
const secret = config.secret;
const Token = require('../db/tokens');
const stringRegex = /[0-9a-zA-Z]+/;

const schema = mongoose.Schema({
    _id: { type: String, unique: true, default: uuid },
    login: { type: String, unique: true, match: stringRegex, index: true },
    salt: { type: String, required: true },
    password: { type: String, required: true },
    stageId: { type: String, default: config.defaultStageId }
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
        password: CryptoJS.SHA256(data.password + salt + secret)
    });

    return user.save().then(user => {
        console.log(`User(id="${user.id}") created`);

        const token = new Token({
            userId: user._id
        });

        return token.save().then(t => {
            console.log(`Token(id="${t.id}") for user(id="${user.id}") created`);
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
