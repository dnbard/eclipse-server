const mongoose = require('mongoose');

const schema = mongoose.Schema({
    _id: { type: String, unique: true },
    value: mongoose.Schema.Types.Mixed
});

schema.statics.createOne = function(key, value){
    if(typeof key !== 'string' || !key){
        return Promise.reject('TypeError: "Key" should be a non-empty string');
    }

    const setting = new Setting({
        _id: key,
        value: value
    });

    return setting.save();
}

const Setting = mongoose.model('settings', schema);

module.exports = Setting;
