"use strict";

const Actor = require('./actor');
const AsteroidsMetadata = require('../public/images/asteroids/asteroids.json');
const Actions = require('../actions');

const GEOMETRY = require('../enums/geometry');
const types = [ 'gray01', 'gray02', 'gray03' ];

class Asteroid extends Actor{
    constructor(options){
        super(options);

        const asteroidData = AsteroidsMetadata[
            Math.trunc(Math.random() * AsteroidsMetadata.length)
        ];

        this.kind = 'asteroid';
        this.type = asteroidData.filename;
        this.size = asteroidData.width * 0.35;
        this.geometry = GEOMETRY.CIRCLE;

        this.vx = 0;
        this.vy = 0;

        this.rotationSpeed = Math.random() * 0.01 - 0.005;

        this.globalRotationAngle = options.angle || null;
        this.globalRotationRadius = options.radius || null;
        this.globalRotationAngleDelta = options.angleDelta || null;

        this.maxArmor = Math.round(Math.random() * 10);
        this.armor = this.maxArmor;

        this.onDamage = Actions.getAction('asteroid/onDamage');
        this.onUpdate = Actions.getAction('asteroid/onUpdate');
        this.onCollide = Actions.getAction('asteroid/onCollide');
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

module.exports = Asteroid;
