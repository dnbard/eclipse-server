const WebSocketServer = require('ws').Server;
var wss = null;

exports.createWSServer = function(server){
    wss = new WebSocketServer({ server: server });

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
        });

        ws.send(JSON.stringify({
            subject: 'eclipse.connection.open',
            message: {
                text: 'initialization',
                stage: [{
                    kind: 'planet',
                    x: 96,
                    y: 96
                }]
            }
        }));
    });

    console.log(`WS Server :: created`);

    return wss;
}
