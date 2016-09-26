define([
    'pixi'
], function(PIXI){
    return function Planet(options){
        const texture = PIXI.loader.resources['/public/images/planet-eE6w1yk0880.png'].texture;
        const sprite = new PIXI.Sprite(texture);

        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        sprite.vx = 0;
        sprite.vy = 0;

        sprite.onUpdate = function(){
            this.x += this.vx;
            this.y += this.vy;
        }

        return sprite;
    }
});
