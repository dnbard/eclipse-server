"use strict";

const logger = require('../core/logger')
    .child({widget_type: 'player'});
const Actor = require('./actor');
const Actions = require('../actions');


class Player extends Actor{
    constructor(options){
        super(options);

        this.armor = options.armor;
        this.maxArmor = options.armor;

        this.bounty = options.bounty || 0;

        this.ship = options.ship || undefined;

        if (options.ship){
            this.size = options.ship.get('size');

            this.armor = options.ship.get('maxArmor');
            this.maxArmor = options.ship.get('maxArmor');

            this.shield = options.ship.get('maxShield');
            this.maxShield = options.ship.get('maxShield');
        }

        this.target = null;

        this.onUpdate = Actions.getAction(options.onUpdate);
        this.onDamage = Actions.getAction(options.onDamage);
        this.onCollide = Actions.getAction(options.onCollide);
    }

    toJSON(){
        const buffs = Object.keys(this.buffs);

        return {
            id: this.id,
            x: this.toFixed(this.x),
            y: this.toFixed(this.y),
            rotation: this.toFixed(this.rotation, 2),
            armor: this.armor,
            maxArmor: this.maxArmor,
            shield: this.shield,
            maxShield: this.maxShield,
            type: this.type,
            size: this.size,
            name: this.name,
            kind: this.kind,
            target: this.target ? this.target.id : null,
            buffs: buffs.length === 0 ? undefined : buffs,
            ship: this.ship ? this.ship.kind : undefined,
            velocity: this.velocity
        }
    }

    isDestroyed(){
        return this.armor <= 0;
    }

    setTarget(target){
        this.target = target;
    }
}

module.exports = Player;
