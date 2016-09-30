define([
    'pixi',
    'pubsub',
    'enums/events'
], (PIXI, PubSub, EVENTS) => {
    var playerId = null;

    PubSub.subscribe(EVENTS.CONNECTION.OPEN, (e, payload) => {
        playerId = payload.message.actorId;
    });

    function defaultBackdropClick(e){
        const x = Math.trunc(e.data.global.x - this.container.x);
        const y = Math.trunc(e.data.global.y - this.container.y);

        PubSub.publish(EVENTS.COMMANDS.PLAYER.MOVETO, {
            x: x,
            y: y,
            stageId: this.container.id,
            playerId: playerId
        });
    }

    return function Backdrop(options){
        options = options || {};

        const backdrop = new PIXI.Graphics();

        backdrop.beginFill(options.color || 0x000000);
        backdrop.drawRect(0, 0, window.innerWidth, window.innerHeight);
        backdrop.endFill();

        backdrop.kind = 'backdrop';

        backdrop.container = options.container;

        backdrop.onUpdate = function(){
            this.x = - options.container.x;
            this.y = - options.container.y;
        }

        backdrop.interactive = true;
        backdrop.click = typeof options.click === 'function' ? options.click : defaultBackdropClick;

        return backdrop;
    }
});
