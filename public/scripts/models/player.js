define([
    'pixi'
], function(PIXI){
    function onUpdate(){
        this.x += this.vx;
        this.y += this.vy;

        if (typeof this.moveTo === 'object' && this.moveTo){
            this.moveTo.ticks ++;

            if (this.moveTo.ticks >= 5){
                this.moveTo = null;
                this.vx = 0;
                this.vy = 0;
            }
        }
    }

    function applyUpdate(newState){
        this.moveTo = {
            x: newState.x,
            y: newState.y,
            diffX: newState.x - this.x,
            diffY: newState.y - this.y,
            velX: (newState.x - this.x ) * 0.2,
            velY: (newState.y - this.y ) * 0.2,
            ticks: 0
        };

        this.vx = this.moveTo.velX;
        this.vy = this.moveTo.velY;
    }

    return function Player(options){
        var player = new PIXI.Graphics();

        player.beginFill(0x9966FF);
        player.drawCircle(0, 0, 16);
        player.endFill();
        player.id = options.id;
        player.kind = 'player';

        player.onUpdate = onUpdate;
        player.applyUpdate = applyUpdate;

        player.vx = 0;
        player.vy = 0;

        return player;
    }
});
