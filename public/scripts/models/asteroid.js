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

    function applyUpdate(newState){
        this.animateMovement = {
            x: newState.x,
            y: newState.y,
            velX: (newState.x - this.x ) * 0.2,
            velY: (newState.y - this.y ) * 0.2,
            ticks: 0
        };

        this.vx = this.animateMovement.velX;
        this.vy = this.animateMovement.velY;

        this.rotation = newState.rotation;
    }

    function onUpdate(){
        this.x += this.vx;
        this.y += this.vy;

        if (typeof this.animateMovement === 'object' && this.animateMovement){
            this.animateMovement.ticks ++;

            if (this.animateMovement.ticks >= 5){
                this.animateMovement = null;
                this.vx = 0;
                this.vy = 0;
            }
        }
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

        asteroid.applyUpdate = applyUpdate;
        asteroid.onDestroy = onDestroy;
        asteroid.onUpdate = onUpdate;

        return asteroid;
    }
});
