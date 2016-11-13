'use strict';

const express = require('express');

const configs = require('./configs');
const logger = require('./core/logger').child({widget_type: 'httpServer'});
const UpdateLoop = require('./core/updateLoop');
const mongo = require('./core/mongo');
const ws = require('./core/ws');
const migrations = require('./core/migrations');

const middlewares = require('./middlewares');
const routing = require('./routing');

const PORT = configs.get('server.port');

const server = require('http').createServer();
const app = express();

const promise = mongo.connect().then(() => {
    return migrations.init();
}).then(() => {
    server.on('request', app);
    server.listen(PORT, () => {
        logger.info(`Listening on port ${PORT}`);
        ws.createWSServer(server);
        middlewares.init(app);
        routing.init(app);

        UpdateLoop.init();
    });
    return app;
}).catch(err => {
   logger.fatal(err);
   process.exit(1);
});

module.exports = promise;
