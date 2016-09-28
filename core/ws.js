const WebSocketServer = require('ws').Server;
const uuid = require('node-uuid').v4;

const Stages = require('./stages');
const Subscriptions = require('./subscriptions');
const Actor = require('../models/actor');
const Events = require('../public/scripts/enums/events');

var wss = null;

exports.createWSServer = function(server){
    wss = new WebSocketServer({ server: server });

    wss.on('connection', function connection(ws) {
        const stage = Stages.getOrCreateGeneric();
        const subscriberId = uuid();

        console.log(`Incoming WS connection (subscriber=${subscriberId})`);

        const player = new Actor({
            kind: 'player',
            x: (Math.random() * 100).toFixed(1),
            y: (Math.random() * 50).toFixed(1),
            onUpdate: function(stage, delta, time){
                this.x = Math.sin(time / 1000) * 100;
                this.y = Math.cos(time / 1000) * 100;
            }
        });
        const actorId = player.id;
        const subscription = Subscriptions.createSubscription(subscriberId, stage.id, ws);

        stage.addActor(player);

        ws.send(JSON.stringify({
            subject: Events.SUBSCRIBE.CREATED,
            message: Object.assign({}, subscription, {
                actorId: actorId
            })
        }));

        ws.send(JSON.stringify({
            subject: Events.CONNECTION.OPEN,
            message: {
                stage: stage,
                actorId: actorId
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
