"use strict";

const Actor = require('./actor');

const GEOMETRY = require('../enums/geometry');

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
            //TODO: add loot to player
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
