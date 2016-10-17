define([
    'pixi',
    'pubsub',
    'core/mouse',
    'enums/events'
], (PIXI, PubSub, Mouse, EVENTS) => {
    var playerId = null,
        rotationInterval = null;

    PubSub.subscribe(EVENTS.CONNECTION.OPEN, (e, payload) => {
        playerId = payload.message.actorId;
    });

    function defaultBackdropMouseDown(e){
        const x = Math.trunc(e.data.global.x - this.container.x);
        const y = Math.trunc(e.data.global.y - this.container.y);

        PubSub.publish(EVENTS.COMMANDS.PLAYER.FIRE, {
            x: x,
            y: y,
            stageId: this.container.id,
            playerId: playerId
        });

        rotationInterval = setInterval(function(){
            const x = Math.trunc(this.mouseGlobalX - this.container.x);
            const y = Math.trunc(this.mouseGlobalY - this.container.y);

            PubSub.publish(EVENTS.COMMANDS.PLAYER.FIRE, {
                x: x,
                y: y,
                stageId: this.container.id,
                playerId: playerId
            });
        }.bind(this), 50);
    }

    function defaultBackdropMouseUp(e){
        const x = Math.trunc(e.data.global.x - this.container.x);
        const y = Math.trunc(e.data.global.y - this.container.y);

        PubSub.publish(EVENTS.COMMANDS.PLAYER.STOP_FIRE, {
            x: x,
            y: y,
            stageId: this.container.id,
            playerId: playerId
        });

        if (rotationInterval){
            clearInterval(rotationInterval);
            rotationInterval = null;
        }
    }

    function defaultBackdropMousemove(e){
        this.mouseGlobalX = e.data.global.x;
        this.mouseGlobalY = e.data.global.y;
    }

    return function Backdrop(options){
        options = options || {};

        const texture = PIXI.loader.resources['/public/images/backgrounds/background_black.jpg'].texture;
        const backdrop = new PIXI.Sprite(texture);

        backdrop.kind = 'backdrop';

        backdrop.anchor.x = 0.125;
        backdrop.anchor.y = 0.25;

        backdrop.container = options.container;

        this.mouseGlobalX = this.mouseGlobalY = 0;

        backdrop.onUpdate = function(){
            this.x = - options.container.x;
            this.y = - options.container.y;

            Mouse.set(
                Math.trunc(this.mouseGlobalX - this.container.x),
                Math.trunc(this.mouseGlobalY - this.container.y)
            );
        }

        backdrop.interactive = true;
        //backdrop.click = typeof options.click === 'function' ? options.click : defaultBackdropClick;
        backdrop.mousedown  = typeof options.mousedown  === 'function' ? options.mousedown  : defaultBackdropMouseDown;
        backdrop.mouseup   = typeof options.mouseup   === 'function' ? options.mouseup   : defaultBackdropMouseUp ;

        backdrop.mousemove = defaultBackdropMousemove;

        return backdrop;
    }
});
