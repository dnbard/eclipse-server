exports.port = process.env.PORT || 3000;
exports._mongoPort = process.env.DEV_MONGO_PORT || 27017;
exports.mongo = process.env.MONGO || `mongodb://localhost:${exports._mongoPort}/eclipse`;
exports.mongoTest = process.env.MONGO_TEST || `mongodb://localhost:${exports._mongoPort}/eclipse-test`;

exports.secret = process.env.SECRET || 'U2FsdGVkX19LTE8mlF/Ta7ahEWkqgwsjD8Fc9c2UnMU=';
/* DON'T FORGET TO SET DIFFERENT SECRET ON REAL SERVERS =) */

exports.debug = process.env.DEBUG ? JSON.parse(process.env.DEBUG) : true;

exports.defaultStageId = 'ce44bd18-b408-492f-b561-0d8f1a8c5421';

exports.appRoot = __dirname;
