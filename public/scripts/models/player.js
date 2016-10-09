define([
    'pixi',
    'pubsub',
    'enums/events',
    'enums/keys',
    'core/hotkey'
], function(PIXI, PubSub, EVENTS, KEYS, Hotkey){
    var playerId = null;

    PubSub.subscribe(EVENTS.CONNECTION.OPEN, (e, data) => {
        playerId = data.message.actorId;
    });


    function onUpdate(){
        this.x += this.vx;
        this.y += this.vy;

       if (this.rotation > Math.PI * 2){
           this.rotation -= Math.PI * 2;
       } else if (this.rotation < -Math.PI * 2){
           this.rotation += Math.PI * 2;
       }

        if (typeof this.animateMovement === 'object' && this.animateMovement){
            this.animateMovement.ticks ++;

            if (this.animateMovement.ticks >= 5){
                this.animateMovement = null;
                this.vx = 0;
                this.vy = 0;
            }
        }
    }

    function applyUpdate(newState){
        this.animateMovement = {
            x: newState.x,
            y: newState.y,
            velX: (newState.x - this.x ) * 0.2,
            velY: (newState.y - this.y ) * 0.2,
            ticks: 0
        };

        this.vx = this.animateMovement.velX;
        this.vy = this.animateMovement.velY;

        const projectedRotation = -(newState.rotation || 0) + Math.PI * 0.5;
        this.rotation = projectedRotation;
    }

    return function Player(options){
        const texture = PIXI.loader.resources['/public/images/spaceship-01.png']
            .texture;
        const player = new PIXI.Sprite(texture);

        player.id = options.id;
        player.kind = 'player';

        player.vx = 0;
        player.vy = 0;

        player.anchor.x = 0.5;
        player.anchor.y = 0.5;

        player.rotation = 0;
        player.rotateDirection = 0;
        player.projectedRotation = Math.PI * 0.5;

        player.onUpdate = onUpdate;
        player.applyUpdate = applyUpdate;

        if (player.id === playerId){
            Hotkey.register({
                keycode: KEYS.W,
                onPress: () => {
                    PubSub.publish(EVENTS.COMMANDS.PLAYER.ACCELERATE);
                },
                onRelease: () => {
                    PubSub.publish(EVENTS.COMMANDS.PLAYER.DECELERATE);
                }
            });

            Hotkey.register({
                keycode: KEYS.A,
                onPress: () => {
                    PubSub.publish(EVENTS.COMMANDS.PLAYER.RADIAL_ACCELERATE, {
                        direction: -1
                    });
                },
                onRelease: () => {
                    PubSub.publish(EVENTS.COMMANDS.PLAYER.RADIAL_DECELERATE);
                }
            });

            Hotkey.register({
                keycode: KEYS.D,
                onPress: () => {
                    PubSub.publish(EVENTS.COMMANDS.PLAYER.RADIAL_ACCELERATE, {
                        direction: 1
                    });
                },
                onRelease: () => {
                    PubSub.publish(EVENTS.COMMANDS.PLAYER.RADIAL_DECELERATE);
                }
            });
        }

        return player;
    }
});
