const WebSocketServer = require('ws').Server;
const uuid = require('./uuid');
const NativeUUID = require('node-uuid').v4;
const Base64 = require('js-base64').Base64;
const url = require('url');
const pako = require('pako');

const Stages = require('./stages');
const Subscriptions = require('./subscriptions');
const packageData = require('../package.json');
const Commands = require('./commands');
const UsersController = require('../controllers/usersController');
const config = require('../config');

const GEOMETRY = require('../enums/geometry');
const EVENTS = require('../public/scripts/enums/events');

var wss = null;

exports.createWSServer = function(server){
    wss = new WebSocketServer({ server: server });

    wss.on('connection', function connection(ws) {
        const stage = Stages.getOrCreateGeneric();
        const location = url.parse(ws.upgradeReq.url, true);
        const token = location.query.token;

        if (!token){
            return ws.close();
        }

        UsersController.getUserByTokenInternal(token).then(data => {
            const Player = require('../models/player');

            const _user = data.user;
            const _token = data.token;
            const subscriberId = _user._id;
            const playerName = _user.login;

            _token.extend().then(() => {
                console.log(`Token(id="${_token._id}") was prolongated`);
            }).catch(() => {
                console.log(`Token(id="${_token._id}") was NOT prolongated`);
            });

            console.log(`Incoming WS connection (subscriber=${subscriberId})`);
            console.log(Player);
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
                name: playerName,
                createdBy: subscriberId
            });
            const actorId = player.id;
            const subscription = Subscriptions.createSubscription(subscriberId, stage.id, ws);

            stage.addActor(player);

            sendMessage(ws, JSON.stringify({
                subject: EVENTS.SUBSCRIBE.CREATED,
                message: Object.assign({}, subscription, {
                    actorId: actorId,
                    isDebug: config.debug
                })
            }));

            sendMessage(ws, JSON.stringify({
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

            if (Subscriptions.getSubscriptionBySubscriberId(subscriberId).length > 1){
                //check for active subscriptions for that user and close WS connection if it was found
                console.log(`Found 2+ subscriptions for Subscriber(id=${subscriberId}, name=${playerName}), closing Subscription(id=${subscription.id})`);
                ws.close();
            }

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
                stage.removeAggro(player);

                stage.removeActorById(actorId);
                Subscriptions.removeSubscriptionBySubscriberId(subscriberId);
            });
        }).catch(err => {
            console.log(err);
            return ws.close();
        });
    });

    console.log(`WS Server :: created`);

    return wss;
}

function sendMessage(ws, message, options){
    options = options || {};

    if (ws.readyState !== ws.OPEN){
        return console.log('Unable to send WS message. Reason - WS already closed.')
    }

    const binaryString = options.packed ? message :
        pako.deflate(message, { to: 'string' });

    ws.send(binaryString);
}

exports.sendMessage = sendMessage;
