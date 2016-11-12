const mongoose = require('mongoose');
const uuid = require('node-uuid').v4;

const schema = mongoose.Schema({
    _id: { type: String, unique: true, default: uuid },
    createdBy: String,
    ownedBy: { type: String, required: true, index: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    kind: { type: String, required: true },
    mods: mongoose.Schema.Types.Mixed
});

const Ship = mongoose.models.ships || mongoose.model('ships', schema);

module.exports = Ship
