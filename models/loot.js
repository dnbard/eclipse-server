"use strict";

const Actor = require('./actor');
const Actions = require('../actions');

const GEOMETRY = require('../enums/geometry');

class Loot extends Actor{
    constructor(options){
        super(options);

        this.kind = 'loot';
        this.type = 'generic';
        this.geometry = GEOMETRY.POINT;

        this.loot = options.loot || null;
        this.quantityMod = options.quantityMod || 1;

        this.rotationSpeed = Math.random() * 0.1 - 0.05;

        this.vx = (Math.random() - 0.5) * (Math.random() * 8 + 14);
        this.vy = (Math.random() - 0.5) * (Math.random() * 8 + 14);

        this.onUpdate = Actions.getAction('loot/defaultUpdate');
        this.onCollide = Actions.getAction('loot/defaultCollide');
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
