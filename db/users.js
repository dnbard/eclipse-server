const uuid = require('node-uuid').v4;
const mongoose = require('mongoose');
const Base64 = require('js-base64').Base64;
const CryptoJS = require("crypto-js");

const secret = require('../config').secret;
const stringRegex = /[0-9a-zA-Z]+/;

const schema = mongoose.Schema({
    _id: { type: String, unique: true, default: uuid },
    login: { type: String, unique: true, match: stringRegex, index: true },
    salt: { type: String, required: true },
    password: { type: String, required: true }
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
        password: CryptoJS.AES.encrypt(data.password + salt, secret)
    });

    return user.save();
}

const User = mongoose.models.users || mongoose.model('users', schema);

module.exports = User;
