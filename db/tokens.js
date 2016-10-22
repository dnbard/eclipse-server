const uuid = require('node-uuid').v4;
const mongoose = require('mongoose');
const Base64 = require('js-base64').Base64;

const schema = mongoose.Schema({
    _id: { type: String, unique: true, default: uuid },
    userId: { type: String, required: true },
    token: { type: String, index: true, default: getToken },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: getExpiredDate }
});

function getExpiredDate(){
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 7);
    return expDate;
}

function getToken(){
    return Base64.encode(uuid());
}

const Token = mongoose.models.tokens || mongoose.model('tokens', schema);
module.exports = Token;
