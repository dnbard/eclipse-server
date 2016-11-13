const mongoose = require('mongoose');
const uuid = require('node-uuid').v4;

const schema = mongoose.Schema({
    _id: { type: String, unique: true, default: uuid },
    ownedBy: { type: String, required: true },
    storedIn: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: String,
    kind: { type: String, required: true },
    mods: mongoose.Schema.Types.Mixed,
    name: String,
    equiped: { type: Boolean, default: false }
});

schema.index({ ownedBy: 1, storedIn: 1 });

const Rig = mongoose.models.rigs || mongoose.model('rigs', schema);

module.exports = Rig;
