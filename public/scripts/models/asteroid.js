define([
    'pixi'
], function(PIXI){
    return function Asteroid(options){
        const texture = PIXI.loader.resources[`/public/images/${options.type}`].texture;
        const asteroid = new PIXI.Sprite(texture);

        asteroid.id = options.id;

        asteroid.anchor.x = 0.5;
        asteroid.anchor.y = 0.5;

        asteroid.vx = 0;
        asteroid.vy = 0;

        asteroid.kind = 'asteroid';

        asteroid.applyUpdate = function(newState){
            this.rotation = newState.rotation;
        }

        return asteroid;
    }
});
