define([
    'pixi'
], function(PIXI){
    return function Planet(options){
        const texture = PIXI.loader.resources['/public/images/planet-cj0ixcXfmRa.png'].texture;
        const planet = new PIXI.Sprite(texture);

        planet.id = options.id;

        planet.anchor.x = 0.5;
        planet.anchor.y = 0.5;

        planet.vx = 0;
        planet.vy = 0;

        planet.kind = 'planet';

        planet.onUpdate = function(){
            this.x += this.vx;
            this.y += this.vy;
        }

        return planet;
    }
});
