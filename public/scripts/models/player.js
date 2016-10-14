define([
    'pixi',
    'pubsub',
    'enums/events',
    'enums/keys',
    'core/hotkey',
    'models/turret',
    'blueprints/ships',
    'components/staticParticle',
    'particles/trail'
], function(PIXI, PubSub, EVENTS, KEYS, Hotkey, Turret, ShipBlueprints, StaticParticle, trail){
    var playerId = null;

    PubSub.subscribe(EVENTS.CONNECTION.OPEN, (e, data) => {
        playerId = data.message.actorId;
    });

    function onDestroy(){
        var args = arguments;
        this.children.filter(c => typeof c.onDestroy === 'function')
            .forEach(c => c.onDestroy.apply(c, args));
    }


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

        if (this.systems){
            this.systems.forEach(systemsIterator);
        }
    }

    function systemsIterator(t){
        if (typeof t.onUpdate === 'function'){
            t.onUpdate();
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

    return function Player(options, stage){
        const blueprint = ShipBlueprints.find(b => b.id === options.type);
        const texture = PIXI.loader.resources[blueprint.texture]
            .texture;
        const player = new PIXI.Container();
        const playerSprite = new PIXI.Sprite(texture);


        player.id = options.id;
        player.kind = 'player';

        player.vx = 0;
        player.vy = 0;

        playerSprite.anchor.x = 0.5;
        playerSprite.anchor.y = 0.5;

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

        player.addChild(playerSprite);
        player.systems = [];

        blueprint.systems.forEach(s => {
            var system = null;

            if (s.kind === 'turret'){
                system = Turret({
                   x: s.offset.x,
                   y: s.offset.y,
                   isControllable: player.id === playerId,
                   parent: player
                });
            } else if (s.kind === 'trail'){
                const offsetX = s.offset.x;
                const offsetY = s.offset.y;

                system = StaticParticle({
                    textures: [
                        PIXI.loader.resources['/public/particles/particle.png'].texture
                    ],
                    particle: trail,
                    x: 0,
                    y: 0,
                    onUpdate: function (){
                        const angle = player.rotation;

                        this.particle.spawnPos.x = offsetX * Math.cos(angle) - offsetY * Math.sin(angle) + player.x;
                        this.particle.spawnPos.y = offsetX * Math.sin(angle) + offsetY * Math.cos(angle) + player.y;

                        this.particle.emit = !!player.animateMovement;
                        this.particle.update(20 * 0.001);
                    }
                });

                return stage.addChild(system);
            }

            if (system){
                player.systems.push(system);
            }
        });

        player.systems.forEach(s => player.addChild(s));

        return player;
    }
});
