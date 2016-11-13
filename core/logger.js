'use strict';

const bunyan = require('bunyan');

const configs = require('../configs');

const APP_NAME = configs.get('app.name');
const LEVEL = configs.get('log.level');
const PATH = configs.get('log.path');

let stream = PATH ? {path: PATH} : {stream: process.stdout};

module.exports = bunyan.createLogger({
    name: APP_NAME,
    streams: [stream],
    level: LEVEL
});
