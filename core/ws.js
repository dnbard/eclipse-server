'use strict';

const WebSocketServer = require('ws').Server;
const NativeUUID = require('node-uuid').v4;
const Base64 = require('js-base64').Base64;
const url = require('url');
const pako = require('pako');

const uuid = require('./uuid');
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

let wss = null;

module.exports = {
    createWSServer: createWSServer,
    sendMessage: sendMessage
};

function createWSServer(server) {
    if (wss) {
        throw new Error('WS server already created');
    }

    wss = new WebSocketServer({ server: server });

    wss.on('connection', ws => {
        const stage = Stages.getOrCreateGeneric();
        const location = url.parse(ws.upgradeReq.url, true);
        const token = location.query.token;

        if (!token){
            return ws.close();
        }

        Promise.resolve({
            ws: ws,
            stage: stage,
            token: token
        })
        .then(getUser)
        .then(getShip)
        .then(addInStage)
        .then(addHandlers)
        .catch(err => {
            logger.error(err);
            ws.close();
        });
    });

    logger.info('Ws server created');

    return wss;
}

function sendMessage(ws, message, options) {
    options = options || {};

    if (ws.readyState !== ws.OPEN) {
        logger.error('Unable to send WS message. Reason - WS already closed.');
        return;
    }

    if (typeof message !== 'string') {
        message = JSON.stringify(message);
    }

    if (!options.packed) {
        message = pako.deflate(message, { to: 'string' });
    }

    ws.send(message);
}

function getUser(data) {
    const token = data.token;

    return UsersController.getUserByTokenInternal(token)
        .then(res => {
            return Object.assign(data, {
                user: res.user,
                _token: res.token
            });
        });
}

function getShip(data) {
    const user = data.user;

    return ShipsController.getOrCreate(user)
        .then(playerShip => {
            return Object.assign(data, {
                playerShip: playerShip
            });
        });
}

function addInStage(data) {
    const Player = require('../models/player'); //TODO: need refactor it's
    const playerShip = data.playerShip;
    const user = data.user;
    const token = data.token;
    const _token = data._token;
    const stage = data.stage;
    const ws = data.ws;

    const subscriberId = user._id;
    const playerName = user.login;

    if (Subscriptions.getSubscriptionBySubscriberId(subscriberId).length >= 1){
        //check for active subscriptions for that user and close WS connection if it was found
        throw new Error(`Subscriber(id=${subscriberId}, name=${playerName}) already has active subscription`);
    }

    const spaceship = new Spaceship(playerShip.base, playerShip.mods, playerShip.id);

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

    return Object.assign(data, {
        player: player
    });
}

function addHandlers(data) {
    const ws = data.ws;
    const user = data.user;
    const token = data.token;
    const player = data.player;
    const stage = data.stage;

    ws.on('message', (payload, flags) => {
        let data;

        try {
            data = JSON.parse(payload);
        } catch(e){
            logger.error(e);
            return;
        }

        if (data.token !== token){
            logger.info(`Received message(subject="${data.subject}") with wrong token from player(id=${player.id}); propagation stopped`);
            return;
        }

        if (!EVENTS._hash[data.subject]) {
            logger.warn(`Received unregistered WS command ${data.subject} from player(id=${player.id})`);
            return;
        }

        logger.info(`Received message(subject="${data.subject}") from player(id=${player.id})`);

        Commands.execute(data.subject, {
            message: data.message,
            subject: data.subject,
            player: player,
            stage: stage
        });
    });

    ws.on('close', () => {
        stage.removeAggro(player);
        stage.removeActorById(player.id);
        Subscriptions.removeSubscriptionBySubscriberId(user._id);
    });
}
