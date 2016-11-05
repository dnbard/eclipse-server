const mongoose = require('mongoose');
const uuid = require('node-uuid').v4;

const schema = mongoose.Schema({
    _id: { type: String, unique: true, default: uuid },
    value: Number,
    overall: Number,
    userId: { type: String, index: true },
    timestamp: { type: Date, default: Date.now }
});

const Transaction = mongoose.models.transaction || mongoose.model('transactions', schema);

module.exports = Transaction;
