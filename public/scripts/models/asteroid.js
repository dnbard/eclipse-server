define([
    'pixi',
    'components/staticParticle',
    'particles/explosion-asteroid'
], function(PIXI, StaticParticle, explosionParticle){
    function onDestroy(stage){
        const explosion = StaticParticle({
            x: this.x,
            y: this.y,
            textures: [
                PIXI.loader.resources['/public/particles/smoke.png'].texture
            ],
            particle: explosionParticle,
            stage: stage
        });

        stage.addChild(explosion);
    }

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

        asteroid.onDestroy = onDestroy;

        return asteroid;
    }
});
