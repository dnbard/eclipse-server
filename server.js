const server = require('http').createServer()
const express = require('express');
const app = express();

const config = require('./config');
const ws = require('./core/ws');
const middlewares = require('./middlewares');
const UpdateLoop = require('./core/updateLoop');
const mongo = require('./core/mongo');

mongo.connect().then(db => {
    server.on('request', app);
    server.listen(config.port, () => {
        console.log(`HTTP Server :: listening on port ${config.port}`);
        ws.createWSServer(server);
        middlewares.init(app);

        UpdateLoop.init();
    });
}).catch(err => {
    console.log(err);
    return process.exit(1);
});
