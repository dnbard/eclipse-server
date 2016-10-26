"use strict";

const Actor = require('./actor');
const Angle = require('../physics/angle');
const Velocity = require('../physics/velocity');
const Projectile = require('../models/projectile');

const GEOMETRY = require('../enums/geometry');

const PLAYER_SPEED = 5;
const PLAYER_ARMOR = 100;
const PLAYER_RADIAL_SPEED = 0.1;
const PLAYER_ROF = 200;

const PROJECTILE_SPEED = 13;
const PROJECTILE_LIFETIME = 1900;

const actions = {
    defaultPlayer: function(stage, delta, time){
        if (this.isAccelerating){
            this.velocity += PLAYER_SPEED * 0.1;
            if (this.velocity > PLAYER_SPEED){
                this.velocity = PLAYER_SPEED;
            }
        } else {
            this.velocity -= PLAYER_SPEED * 0.025;
            if (this.velocity < 0){
                this.velocity = 0;
            }
        }

        if (this.rotateDirection !== 0){
            this.radialVelocity = Velocity.getRadialVelocity(this.velocity, PLAYER_SPEED, PLAYER_RADIAL_SPEED) * this.rotateDirection;
        } else {
            this.radialVelocity -= PLAYER_RADIAL_SPEED * 0.3;
            if (this.radialVelocity < 0){
                this.radialVelocity = 0;
            }
        }

        if (this.velocity){
            const velocity = Velocity.get2DVelocity(-this.rotation, this.velocity);
            this.x += velocity.x;
            this.y += velocity.y;
        }

        if (this.radialVelocity){
            this.rotation += this.radialVelocity;
        }

        if (this.rotation > Math.PI * 2){
            this.rotation -= Math.PI * 2;
        } else if (this.rotation < -Math.PI * 2){
            this.rotation += Math.PI * 2;
        }

        if (this.firing && time - (this.lastShot || 0) > PLAYER_ROF){
            const angle = Angle.getAngleBetweenTwoPoints( this.x, this.y, this.firing.x, this.firing.y );
            const velocity = Velocity.get2DVelocity(angle, PROJECTILE_SPEED);
            const projectile = new Projectile({
                x: this.x,
                y: this.y,
                rotation: -angle,
                vx: velocity.x,
                vy: velocity.y,
                ttl: PROJECTILE_LIFETIME,
                onUpdate: 'defaultProjectile',
                geometry: GEOMETRY.POINT,
                onCollide: 'defaultProjectileCollision',
                createdBy: this.id
            });

            this.lastShot = time;
            stage.addActor(projectile);
        }
    },
    defaultPlayerDamage: function(projectile, stage){
        this.armor -= projectile.damage;

        if (this.isDestroyed()){
            if (this.type === "player-base"){
                this.x = 0;
                this.y = 0;
                this.armor = PLAYER_ARMOR;
            } else {
                stage.removeActorById(this.id);
            }
        }
    }
}

class Player extends Actor{
    constructor(options){
        super(options);

        this.armor = options.armor || PLAYER_ARMOR;
        this.maxArmor = options.armor || PLAYER_ARMOR;

        this.setMethod(actions, options, 'onUpdate');
        this.setMethod(actions, options, 'onCollide');
        this.setMethod(actions, options, 'onDamage');
    }

    toJSON(){
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            armor: this.armor,
            maxArmor: this.maxArmor,
            type: this.type,
            size: this.size,
            name: this.name,
            kind: this.kind
        }
    }

    isDestroyed(){
        return this.armor <= 0;
    }
}

module.exports = Player;
