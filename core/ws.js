const WebSocketServer = require('ws').Server;
const uuid = require('node-uuid').v4;
const Base64 = require('js-base64').Base64;

const Stages = require('./stages');
const Subscriptions = require('./subscriptions');
const Actor = require('../models/actor');
const EVENTS = require('../public/scripts/enums/events');
const packageData = require('../package.json');

const Angle = require('../physics/angle');
const Velocity = require('../physics/velocity');

const PLAYER_SPEED = 3;
const PIXEL_THRESHOLD = PLAYER_SPEED * 2;

var wss = null;

exports.createWSServer = function(server){
    wss = new WebSocketServer({ server: server });

    wss.on('connection', function connection(ws) {
        const stage = Stages.getOrCreateGeneric();
        const subscriberId = uuid();
        const token = Base64.encode(uuid());

        console.log(`Incoming WS connection (subscriber=${subscriberId})`);

        const deltaTime = Math.random() * 1000
        const player = new Actor({
            kind: 'player',
            x: Math.random() * 100,
            y: Math.random() * 100,
            onUpdate: function(stage, delta, time){
                if (this.moveToX || this.moveToY){
                    const angle = Angle.getAngleBetweenTwoPoints(this.x, this.y, this.moveToX, this.moveToY);
                    this.velocity = Velocity.get2DVelocity(angle, PLAYER_SPEED);
                    this.rotation = -angle;
                } else {
                    this.velocity = null;
                }

                if (!this.velocity || (Math.abs(this.x - this.moveToX) < PIXEL_THRESHOLD && Math.abs(this.y - this.moveToY) < PIXEL_THRESHOLD)){
                    this.moveToX = null;
                    this.moveToY = null;
                }

                if (this.velocity){
                    this.x += this.velocity.x;
                    this.y += this.velocity.y;
                }
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
            } else {
                console.log(`Received message(subject="${data.subject}") from player(id=${player.id})`);
            }

            player.moveToX = data.message.x;
            player.moveToY = data.message.y;
        });

        ws.on('close', () => {
            stage.removeActorById(actorId);
            Subscriptions.removeSubscriptionBySubscriberId(subscriberId);
        });
    });

    console.log(`WS Server :: created`);

    return wss;
}
