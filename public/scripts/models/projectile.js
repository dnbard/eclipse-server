define([
    'pixi'
], function(PIXI){
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


    return function Projectile(options){
        const texture = PIXI.loader.resources['/public/images/projectile-01.png'].texture;
        const projectile = new PIXI.Sprite(texture);

        projectile.id = options.id;

        projectile.anchor.x = 0.5;
        projectile.anchor.y = 0.5;

        projectile.vx = options.vx * 0.2;
        projectile.vy = options.vy * 0.2;

        projectile.kind = 'projectile';
        projectile.rotation = -options.rotation + Math.PI * 0.5;

        projectile.onUpdate = onUpdate;
        projectile.applyUpdate = applyUpdate;

        return projectile;
    }
});
