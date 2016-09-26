define([
    'pixi'
], function(PIXI){
    return function Player(options){
        var circle = new PIXI.Graphics();
        circle.beginFill(0x9966FF);
        circle.drawCircle(0, 0, 16);
        circle.endFill();

        circle.onUpdate = function(){
            this.x += this.vx;
            this.y += this.vy;
        }

        return circle;
    }
});
