define([
    'pixi',
    'particles/projectile-ion',
    'particles/projectile-mining',
    'particles/explosion-small-ion',
    'components/staticParticle',

    'pixi-particles'
], function(PIXI, particle, miningParticle, particleExplosion, StaticParticle){
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

    function onDestroy(stage){
        this.particle.destroy();

        const explosion = StaticParticle({
            x: this.x + this.vx,
            y: this.y + this.vy,
            textures: [PIXI.loader.resources['/public/particles/particle.png'].texture],
            particle: particleExplosion.get(this.type),
            stage: stage
        });

        stage.addChild(explosion);
    }

    function onUpdate(stage, delta){
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

        this.particle.update(20*0.001);
    }


    return function Projectile(options, stage){
        const projectile = new PIXI.Container();

        if (options.type === 'ion'){
            projectile.particle = new PIXI.particles.Emitter(projectile,
                [PIXI.loader.resources['/public/particles/particle.png'].texture], particle);
        } else if (options.type === 'mining'){
            projectile.particle = new PIXI.particles.Emitter(projectile,
                [PIXI.loader.resources['/public/particles/particle.png'].texture], miningParticle);
        } else {
            throw new Error(`Missing particle emitter(type=${options.type})`);
        }

        projectile.id = options.id;

        projectile.vx = options.vx * 0.2;
        projectile.vy = options.vy * 0.2;

        projectile.type = options.type;

        projectile.kind = 'projectile';
        projectile.rotation = -options.rotation + Math.PI * 0.5;

        projectile.onUpdate = onUpdate;
        projectile.applyUpdate = applyUpdate;
        projectile.onDestroy = onDestroy;

        return projectile;
    }
});
