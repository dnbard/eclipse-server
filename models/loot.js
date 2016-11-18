"use strict";

const Actor = require('./actor');
const Rig = require('../db/rigs');

const GEOMETRY = require('../enums/geometry');
const Minerals = require('../data/rigs/minerals.json');

class Loot extends Actor{
    constructor(options){
        super(options);

        this.kind = 'loot';
        this.type = 'generic';
        this.geometry = GEOMETRY.POINT;

        this.loot = options.loot || null;

        this.rotationSpeed = Math.random() * 0.1 - 0.05;

        this.vx = (Math.random() - 0.5) * (Math.random() * 8 + 14);
        this.vy = (Math.random() - 0.5) * (Math.random() * 8 + 14);
    }

    onUpdate(){
        this.rotation += this.rotationSpeed;

        if (this.vx !== 0 || this.vy !== 0){
            this.x += this.vx;
            this.y += this.vy;

            this.vx *= 0.9;
            this.vy *= 0.9;

            if (this.vx < 0.9){
                this.vx = 0;
            }

            if (this.vy < 0.9){
                this.vy = 0;
            }
        }
    }

    onCollide(actor, stage){
        if (actor.kind === 'player' && actor.type === 'player-base'){
            stage.removeActorById(this.id);

            Rig.createOrStack({
                ownedBy: actor.createdBy,
                storedIn: actor.ship.id,
                kind: this.loot.id,
                name: this.loot.name,
                quantity: Math.round(Math.random() * (this.loot.quantity.max - this.loot.quantity.min) + this.loot.quantity.min)
            });
        }
    }

    toJSON(){
        return {
            id: this.id,
            x: this.toFixed(this.x),
            y: this.toFixed(this.y),
            rotation: this.toFixed(this.rotation, 2),
            type: this.type,
            kind: this.kind
        }
    }
}

module.exports = Loot;
