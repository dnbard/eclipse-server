define([
    'pixi',
    'pubsub',
    'core/mouse',
    'enums/events'
], (PIXI, PubSub, Mouse, EVENTS) => {
    var playerId = null;

    PubSub.subscribe(EVENTS.CONNECTION.OPEN, (e, payload) => {
        playerId = payload.message.actorId;
    });

    function defaultBackdropClick(e){
        const x = Math.trunc(e.data.global.x - this.container.x);
        const y = Math.trunc(e.data.global.y - this.container.y);

        PubSub.publish(EVENTS.COMMANDS.PLAYER.FIRE, {
            x: x,
            y: y,
            stageId: this.container.id,
            playerId: playerId
        });
    }

    function defaultBackdropMousemove(e){
        this.mouseGlobalX = e.data.global.x;
        this.mouseGlobalY = e.data.global.y;
    }

    return function Backdrop(options){
        options = options || {};

        const backdrop = new PIXI.Graphics();

        backdrop.beginFill(options.color || 0x000000);
        backdrop.drawRect(0, 0, window.innerWidth, window.innerHeight);
        backdrop.endFill();

        backdrop.kind = 'backdrop';

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
        backdrop.click = typeof options.click === 'function' ? options.click : defaultBackdropClick;

        backdrop.mousemove = defaultBackdropMousemove;

        return backdrop;
    }
});
