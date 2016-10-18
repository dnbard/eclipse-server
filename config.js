exports.port = process.env.PORT || 3000;
exports.mongo = process.env.MONGO || 'mongodb://localhost:27017/eclipse';
exports.mongoTest = process.env.MONGO_TEST || 'mongodb://localhost:27017/eclipse-test';

exports.appRoot = __dirname;
