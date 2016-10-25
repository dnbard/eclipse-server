"use strict";

const Actor = require('./actor');

const actions = {
    defaultProjectile: function(stage, delta){
        this.x += this.vx;
        this.y += this.vy;

        if (this.ttl){
            this.ttl -= delta;

            if (this.ttl <= 0){
                stage.removeActorById(this.id);
            }
        }
    },
    defaultProjectileCollision: function(actor, stage){
        if(actor.id === this.createdBy){
            return;
        }

        stage.removeActorById(this.id);

        if (typeof actor.onDamage === 'function'){
            actor.onDamage(this, stage);
        }
    }
}

class Projectile extends Actor{
    constructor(options){
        super(options);

        this.kind = 'projectile';
        this.armor = 0;
        this.maxArmor = 0;

        this.damage = 10;

        this.setMethod(actions, options, 'onUpdate');
        this.setMethod(actions, options, 'onCollide');
    }

    toJSON(){
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            vx: this.vx,
            vy: this.vy,
            rotation: this.rotation,
            kind: this.kind
        }
    }
}

module.exports = Projectile;
