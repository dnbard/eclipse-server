const uuid = require('node-uuid');

const mongo = require('../core/mongo');
const COLLECTIONS = require('../enums/collections');

exports.createOne = function(key, value){
    return new Promise((res, rej) => {
        const db = mongo.getDatabase();
        const Collection = db.collection(COLLECTIONS.SETTINGS);

        if(typeof key !== 'string' || !key){
            return rej('TypeError: "Key" should be a non-empty string');
        }

        Collection.insertOne({
            _id: key,
            value: value
        }, (err, result) => {
            if (err){
                return rej(err);
            }

            Collection.findOne({ _id: result.insertedId },
                (err, doc)=> err ? rej(err) : res(doc));
        });
    });
}
