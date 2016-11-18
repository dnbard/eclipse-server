'use strict';

const WebSocketServer = require('ws').Server;
const uuid = require('./uuid');
const NativeUUID = require('node-uuid').v4;
const Base64 = require('js-base64').Base64;
const url = require('url');
const pako = require('pako');

const logger = require('./logger').child({widget_type: 'wsServer'});
const Stages = require('./stages');
const Subscriptions = require('./subscriptions');
const packageData = require('../package.json');
const Commands = require('./commands');
const UsersController = require('../controllers/usersController');
const ShipsController = require('../controllers/shipsController');
const configs = require('../configs');
const Spaceship = require('../models/spaceship');

const DEBUG_UI = configs.get('debug.ui');
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

        var _user = null;
        var _token = null;
        UsersController.getUserByTokenInternal(token).then(data => {
            _user = data.user;
            _token = data.token;

            return ShipsController.getOrCreate(_user);
        }).then(playerShip => {
            const Player = require('../models/player');
            const spaceship = new Spaceship(playerShip.base, playerShip.mods, playerShip.id);

            const subscriberId = _user._id;
            const playerName = _user.login;

            _token.extend().then(() => {
                logger.info(`Token(id="${_token._id}") was prolongated`);
            }).catch(() => {
                logger.warn(`Token(id="${_token._id}") was NOT prolongated`);
            });

            logger.info(`Incoming WS connection (subscriber=${subscriberId})`);

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
                createdBy: subscriberId,
                ship: spaceship
            });
            const actorId = player.id;
            const subscription = Subscriptions.createSubscription(subscriberId, stage.id, ws);

            stage.addActor(player);

            sendMessage(ws, JSON.stringify({
                subject: EVENTS.SUBSCRIBE.CREATED,
                message: Object.assign({}, subscription, {
                    actorId: actorId,
                    isDebug: DEBUG_UI
                })
            }));

            sendMessage(ws, JSON.stringify({
                subject: EVENTS.CONNECTION.OPEN,
                message: {
                    stage: stage,
                    spaceship: playerShip,
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
                logger.warn(`Found 2+ subscriptions for Subscriber(id=${subscriberId}, name=${playerName}), closing Subscription(id=${subscription.id})`);
                ws.close();
            }

            ws.on('message', (payload, flags) => {
                var data;

                try{
                    data = JSON.parse(payload);
                } catch(e){
                    logger.error(e);
                }

                if (data.token !== token){
                    return logger.info(`Received message(subject="${data.subject}") with wrong token from player(id=${player.id}); propagation stopped`);
                }

                if (EVENTS._hash[data.subject]){
                    logger.info(`Received message(subject="${data.subject}") from player(id=${player.id})`);

                    Commands.execute(data.subject, {
                        message: data.message,
                        subject: data.subject,
                        player: player,
                        stage: stage
                    });
                } else {
                    logger.warn(`Received unregistered WS command ${data.subject} from player(id=${player.id})`);
                }
            });

            ws.on('close', () => {
                stage.removeAggro(player);

                stage.removeActorById(actorId);
                Subscriptions.removeSubscriptionBySubscriberId(subscriberId);
            });
        }).catch(err => {
            logger.error(err);
            return ws.close();
        });
    });

    logger.info('Ws server created');

    return wss;
}

function sendMessage(ws, message, options){
    options = options || {};

    if (ws.readyState !== ws.OPEN){
        return logger.warn('Unable to send WS message. Reason - WS already closed.')
    }

    if (typeof message !== 'string'){
        message = JSON.stringify(message);
    }

    const binaryString = options.packed ? message :
        pako.deflate(message, { to: 'string' });

    ws.send(binaryString);
}

exports.sendMessage = sendMessage;
