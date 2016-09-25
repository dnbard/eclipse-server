const WebSocketServer = require('ws').Server;
const uuid = require('node-uuid').v4;

const Stages = require('./stages');
const Subscriptions = require('./subscriptions');

var wss = null;

exports.createWSServer = function(server){
    wss = new WebSocketServer({ server: server });

    wss.on('connection', function connection(ws) {
        const stage = Stages.getOrCreateGeneric();
        const subscriberId = uuid();

        const subscription = Subscriptions.createSubscription(subscriberId, stage.id);

        ws.send(JSON.stringify({
            subject: 'eclipse.subscribe.created',
            message: subscription
        }));

        ws.send(JSON.stringify({
            subject: 'eclipse.connection.open',
            message: {
                text: 'initialization',
                stage: stage
            }
        }));

        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
        });
    });

    console.log(`WS Server :: created`);

    return wss;
}
