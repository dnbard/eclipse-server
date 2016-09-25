define([], function(){
    return function Planet(options){
        const sprite = new PIXI.Sprite(PIXI.loader.resources['/public/images/planet-eE6w1yk0880.png'].texture)

        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        sprite.onUpdate = function(){
            this.vx = 1;
            this.vy = 1;

            this.x += this.vx;
            this.y += this.vy;
        }

        return sprite;
    }
});
