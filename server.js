const express = require('express');

const UpdateLoop = require('./core/updateLoop');
const mongo = require('./core/mongo');
const ws = require('./core/ws');

const middlewares = require('./middlewares');
const config = require('./config');

//mongo.connect().then(db => {
    const server = require('http').createServer();
    const app = express();

    server.on('request', app);
    server.listen(config.port, () => {
        console.log(`HTTP Server :: listening on port ${config.port}`);
        ws.createWSServer(server);
        middlewares.init(app);

        UpdateLoop.init();
    });
//}).catch(err => {
//    console.log(err);
//    return process.exit(1);
//});
