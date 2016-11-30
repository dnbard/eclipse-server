"use strict";

const Actor = require('./actor');
const Actions = require('../actions');

class Projectile extends Actor{
    constructor(options){
        super(options);

        this.kind = 'projectile';
        this.armor = 0;
        this.maxArmor = 0;

        this.damage = Math.round(Math.random() * (options.damageMax - options.damageMin) + options.damageMin);

        this.onUpdate = Actions.getAction('projectile/default');
        this.onCollide = Actions.getAction('projectile/defaultCollision');
    }

    toJSON(){
        return {
            id: this.id,
            x: this.toFixed(this.x),
            y: this.toFixed(this.y),
            vx: this.toFixed(this.vx, 1),
            vy: this.toFixed(this.vy, 1),
            rotation: this.toFixed(this.rotation, 2),
            kind: this.kind,
            type: this.type
        }
    }
}

module.exports = Projectile;
