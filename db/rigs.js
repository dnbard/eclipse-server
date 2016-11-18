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
    equipped: { type: Boolean, default: false },
    quantity: { type: Number, default: 1 }
});

schema.index({ ownedBy: 1, storedIn: 1, kind: 1 });

schema.statics.createOrStack = function(options){
    return Rig.findOne({
        ownedBy: options.ownedBy,
        storedIn: options.storedIn,
        kind: options.kind
    }).exec().then(rig => {
        if (!rig){
            rig = new Rig({
                ownedBy: options.ownedBy,
                storedIn: options.storedIn,
                kind: options.kind,
                name: options.name,
                mods: options.mods || {},
                quantity: options.quantity
            });
        } else {
            rig.quantity += options.quantity;
        }

        return rig.save();
    });
}

const Rig = mongoose.models.rigs || mongoose.model('rigs', schema);

module.exports = Rig;
