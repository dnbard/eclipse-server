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

        var px = Math.random() * 100;
        var py = Math.random() * 100;
        const deltaTime = Math.random() * 1000
        const player = new Actor({
            kind: 'player',
            x: px,
            y: py/*,
            onUpdate: function(stage, delta, time){
                const _time = time + deltaTime;
            }*/
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

        ws.on('message', (payload, flags) => {
            try{
                const data = JSON.parse(payload);
            } catch(e){
                console.err(e);
            }

            //TODO: apply token based verification
            if (data.message.playerId !== player.id){
                return console.log(`Received message with playerId=${data.message.playerId} from ${player.id}, execution stopped`);
            }

            player.x = data.message.x;
            player.y = data.message.y;
        });

        ws.on('close', () => {
            stage.removeActorById(actorId);
            Subscriptions.removeSubscriptionBySubscriberId(subscriberId);
        });
    });

    console.log(`WS Server :: created`);

    return wss;
}
