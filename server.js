const server = require('http').createServer()
const express = require('express');
const app = express();

const config = require('./config');
const ws = require('./core/ws');
const middlewares = require('./middlewares');
const UpdateLoop = require('./core/updateLoop');

server.on('request', app);
server.listen(config.port, () => {
    console.log(`HTTP Server :: listening on port ${config.port}`);
    ws.createWSServer(server);
    middlewares.init(app);

    UpdateLoop.init();
});
