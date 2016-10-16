const WebSocketServer = require('ws').Server;
const uuid = require('node-uuid').v4;
const Base64 = require('js-base64').Base64;
const url = require('url');

const Stages = require('./stages');
const Subscriptions = require('./subscriptions');
const Player = require('../models/player');
const packageData = require('../package.json');
const Commands = require('./commands');

const GEOMETRY = require('../enums/geometry');
const EVENTS = require('../public/scripts/enums/events');

var wss = null;

exports.createWSServer = function(server){
    wss = new WebSocketServer({ server: server });

    wss.on('connection', function connection(ws) {
        const stage = Stages.getOrCreateGeneric();
        const subscriberId = uuid();
        const token = Base64.encode(uuid());

        const location = url.parse(ws.upgradeReq.url, true);
        const playerName = location.query.name;

        console.log(`Incoming WS connection (subscriber=${subscriberId})`);

        const deltaTime = Math.random() * 1000
        const player = new Player({
            kind: 'player',
            type: 'player-base',
            x: Math.random() * 100,
            y: Math.random() * 100,
            onUpdate: 'defaultPlayer',
            onDamage: 'defaultPlayerDamage',
            geometry: GEOMETRY.CIRCLE,
            size: 22,
            name: playerName
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
                },
                token: token
            }
        }));

        ws.on('message', (payload, flags) => {
            var data;

            try{
                data = JSON.parse(payload);
            } catch(e){
                console.err(e);
            }

            if (data.token !== token){
                return console.log(`Received message(subject="${data.subject}") with wrong token from player(id=${player.id}); propagation stopped`);
            }

            if (EVENTS._hash[data.subject]){
                console.log(`Received message(subject="${data.subject}") from player(id=${player.id})`);

                Commands.execute(data.subject, {
                    message: data.message,
                    subject: data.subject,
                    player: player,
                    stage: stage
                });
            } else {
                console.log(`Received unregistered WS command ${data.subject} from player(id=${player.id})`);
            }
        });

        ws.on('close', () => {
            stage.removeActorById(actorId);
            Subscriptions.removeSubscriptionBySubscriberId(subscriberId);
        });
    });

    console.log(`WS Server :: created`);

    return wss;
}

exports.sendMessage = function(ws, message){
    if (ws.readyState !== ws.OPEN){
        return console.log('Unable to send WS message. Reason - WS already closed.')
    }

    ws.send(message);
}
