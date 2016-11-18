define([
    'pixi',
    'components/staticParticle',
    'particles/explosion-asteroid'
], function(PIXI, StaticParticle, explosionParticle){
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
            }
        }
    }

    return function Loot(options){
        const texture = PIXI.loader.resources['/public/images/container.png'].texture;
        const loot = new PIXI.Sprite(texture);

        loot.id = options.id;

        loot.anchor.x = 0.5;
        loot.anchor.y = 0.5;

        loot.vx = 0;
        loot.vy = 0;

        loot.kind = 'loot';

        loot.applyUpdate = applyUpdate;
        loot.onUpdate = onUpdate;

        return loot;
    }
});
