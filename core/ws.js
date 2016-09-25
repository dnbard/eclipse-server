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
        const actorId = uuid();
        const subscription = Subscriptions.createSubscription(subscriberId, stage.id);

        stage.addActor({
            kind: 'player',
            x: (Math.random() * 1000).toFixed(1),
            y: (Math.random() * 800).toFixed(1),
            id: actorId
        })

        ws.send(JSON.stringify({
            subject: 'eclipse.subscribe.created',
            message: Object.assign({}, subscription, {
                actorId: actorId
            })
        }));

        ws.send(JSON.stringify({
            subject: 'eclipse.connection.open',
            message: {
                stage: stage
            }
        }));

        ws.on('message', (message) => {
            console.log('received: %s', message);
        });

        ws.on('close', () => {
            stage.removeActorById(actorId);
            Subscriptions.removeSubscriptionBySubscriberId(subscriberId);
        });
    });

    console.log(`WS Server :: created`);

    return wss;
}
