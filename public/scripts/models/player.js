define([
    'pixi'
], function(PIXI){
    function onUpdate(){
        this.x += this.vx;
        this.y += this.vy;
    }

    return function Player(options){
        var player = new PIXI.Graphics();

        player.beginFill(0x9966FF);
        player.drawCircle(0, 0, 16);
        player.endFill();
        player.id = options.id;
        player.kind = 'player';

        player.onUpdate = onUpdate;

        player.vx = 1;
        player.vy = 1;

        return player;
    }
});
