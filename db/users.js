const uuid = require('node-uuid');

const validator = require('node-validator');
const stringRegex = /[0-9a-zA-Z]+/;
const mongo = require('../core/mongo');
const COLLECTIONS = require('../enums/collections');

exports.createOne = (data) => {
    return new Promise((res, rej) => {
        const check = validator.isObject(data)
            .withRequired('login', validator.isString({regex: stringRegex}))
            .withRequired('password', validator.isString({regex: stringRegex}));

        validator.run(check, data, (errorCount, errors) => {
            const db = mongo.getDatabase();
            const UsersCollection = db.collection(COLLECTIONS.USERS);

            if (errorCount){
                return rej(errors);
            }

            UsersCollection.insertOne({
                _id: uuid(),
                login: data.login,
                password: data.password
            }, (err, result) => {
                if (err){
                    return rej(err);
                }

                UsersCollection.findOne({ _id: result.insertedId },
                    (err, doc)=> err ? rej(err) : res(doc));
            });
        });
    });
}
