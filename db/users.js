const validator = require('node-validator');
const stringRegex = /[0-9a-zA-Z]+/;

exports.createOne = (data) => {
    return new Promise((res, rej) => {
        const check = validator.isObject(data)
            .withRequired('login', validator.isString({regex: stringRegex}))
            .withRequired('password', validator.isString({regex: stringRegex}));

        validator.run(check, data, function(errorCount, errors) {
            if (errorCount){
                return rej(errors);
            }

            res(data);
        });
    });
}
