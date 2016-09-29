const WebSocketServer = require('ws').Server;
const uuid = require('node-uuid').v4;

const Stages = require('./stages');
const Subscriptions = require('./subscriptions');
const Actor = require('../models/actor');
const EVENTS = require('../public/scripts/enums/events');
const packageData = require('../package.json');

var wss = null;

exports.createWSServer = function(server){
    wss = new WebSocketServer({ server: server });

    wss.on('connection', function connection(ws) {
        const stage = Stages.getOrCreateGeneric();
        const subscriberId = uuid();

        console.log(`Incoming WS connection (subscriber=${subscriberId})`);

        const px = Math.random() * 100;
        const py = Math.random() * 100;
        const deltaTime = Math.random() * 1000
        const player = new Actor({
            kind: 'player',
            x: px,
            y: py,
            onUpdate: function(stage, delta, time){
                const _time = time + deltaTime;
                this.x = px + Math.sin(_time / 1000) * 100;
                this.y = py + Math.cos(_time / 1000) * 100;
            }
        });
        const actorId = player.id;
        const subscription = Subscriptions.createSubscription(subscriberId, stage.id, ws);

        stage.addActor(player);

        ws.send(JSON.stringify({
            subject: EVENTS.SUBSCRIBE.CREATED,
            message: Object.assign({}, subscription, {
                actorId: actorId
            })
        }));

        ws.send(JSON.stringify({
            subject: EVENTS.CONNECTION.OPEN,
            message: {
                stage: stage,
                actorId: actorId,
                application: {
                    title: 'Eclipse',
                    version: packageData.version
                }
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
