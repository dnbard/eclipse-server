exports.port = process.env.PORT || 3000;
exports._mongoPort = process.env.DEV_MONGO_PORT || 27017;
exports.mongo = process.env.MONGO || `mongodb://localhost:${exports._mongoPort}/eclipse`;
exports.mongoTest = process.env.MONGO_TEST || `mongodb://localhost:${exports._mongoPort}/eclipse-test`;

exports.appRoot = __dirname;
