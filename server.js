const express = require('express');

const UpdateLoop = require('./core/updateLoop');
const mongo = require('./core/mongo');
const ws = require('./core/ws');
const migrations = require('./core/migrations');

const middlewares = require('./middlewares');
const config = require('./config');
const routing = require('./routing');

mongo.connect().then(() => {
    return migrations.init();
}).then(() => {
    const server = require('http').createServer();
    const app = express();

    server.on('request', app);
    server.listen(config.port, () => {
        console.log(`HTTP Server :: listening on port ${config.port}`);
        ws.createWSServer(server);
        middlewares.init(app);
        routing.init(app);

        UpdateLoop.init();
    });
}).catch(err => {
   console.log(err);
   return process.exit(1);
});
