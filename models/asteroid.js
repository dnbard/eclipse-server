"use strict";

const Actor = require('./actor');
const AsteroidsMetadata = require('../public/images/asteroids/asteroids.json');
const Minerals = require('../data/rigs/minerals.json');
const Loot = require('../models/loot');

const GEOMETRY = require('../enums/geometry');
const COLLISION_VELOCITY = 1;

const types = [
    'gray01',
    'gray02',
    'gray03'
];

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

        this.maxArmor = Math.round(Math.random() * 10);
        this.armor = this.maxArmor;
    }

    onDamage(actor, stage){
        this.armor --;

        if (this.armor <= 0){
            stage.removeActorById(this.id);
            const quantity = Math.ceil(Math.random() * 4);
            const lootObject = {
                x: this.x,
                y: this.y,
                loot: Minerals.chrondite
            };

            for (var i = 0; i < quantity; i++){
                var loot = new Loot(lootObject);
                stage.addActor(loot);
            }
        }
    }

    onUpdate(){
        this.x += this.vx;
        this.y += this.vy;

        this.vx -= 0.05 * this.vx;
        this.vy -= 0.05 * this.vy;

        this.rotation += this.rotationSpeed;

        if (this.rotation > Math.PI){
            this.rotation -= Math.PI * 2;
        } else if (this.rotation < -Math.PI){
            this.rotation += Math.PI * 2;
        }
    }

    onCollide(actor, stage){
        if (actor.kind === 'player'){
            const angle = -actor.rotation;

            this.vx = Math.cos(angle) * COLLISION_VELOCITY;
            this.vy = Math.sin(angle) * COLLISION_VELOCITY;

            actor.velocity = 0;
            actor.rotation += Math.random() * 0.6 - 0.3;

            actor.onDamage(null, stage , 1);
        } else if (actor.kind === 'asteroid'){
            this.vx = actor.vx;
            this.vy = actor.vy;
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

module.exports = Asteroid;
