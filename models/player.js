"use strict";

const logger = require('../core/logger').child({widget_type: 'player'});
const Actor = require('./actor');
const Angle = require('../physics/angle');
const Velocity = require('../physics/velocity');
const Projectile = require('../models/projectile');
const Transactions = require('../core/transactions');
const PVP = require('../core/pvp');

const GEOMETRY = require('../enums/geometry');
const BUFFS = require('../enums/buffs');

const HALF_PI = Math.PI * 0.5;
const TRESHOLD_PI = Math.PI * 0.99;

const actions = {
    morderDroneUpdate: function(){
        const target = this.target;

        if (target){
            this.rotateDirection = 0;

            const newRotation = -Angle.getAngleBetweenTwoPoints(
                this.x, this.y, target.x, target.y
            );
            const rotationDirection = this.rotation > newRotation ? -1 : 1;
            const difference = Math.abs(this.rotation - newRotation);

            if (difference < this.ship.get('radialSpeed') ||
                (Math.abs(this.rotation) > TRESHOLD_PI &&
                 Math.abs(newRotation) > TRESHOLD_PI)
            ){
                this.rotation = newRotation;
            } else {
                this.rotation += this.ship.get('radialSpeed') * rotationDirection;
            }
        } else if (this.rotateDirection === 0) {
            this.rotateDirection = Math.random() > 0.5 ? 1 : -1;
        }

        actions.defaultNPC.apply(this, arguments);
    },
    defaultNPC: function(){
        actions.defaultPlayer.apply(this, arguments);
    },
    defaultPlayer: function(stage, delta, time){
        if (this.isAccelerating){
            this.velocity += this.ship.get('speed') * 0.1;
            if (this.velocity > this.ship.get('speed')){
                this.velocity = this.ship.get('speed');
            }
        } else {
            this.velocity -= this.ship.get('speed') * 0.025;
            if (this.velocity < 0){
                this.velocity = 0;
            }
        }

        if (this.rotateDirection !== 0){
            this.radialVelocity = Velocity.getRadialVelocity(this.velocity, this.ship.get('speed'), this.ship.get('radialSpeed')) * this.rotateDirection;
        } else {
            this.radialVelocity -= this.ship.get('radialSpeed') * 0.3;
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

        if (this.rotation > Math.PI){
            this.rotation -= Math.PI * 2;
        } else if (this.rotation < -Math.PI){
            this.rotation += Math.PI * 2;
        }

        if (this.firing && typeof this.firing === 'object'
            && typeof this.firing.x === 'number' && typeof this.firing.y === 'number'
            && time - (this.lastShot || 0) > this.ship.get('rof')){
            this.ship.getTurrets().forEach(t => {
                const angle = Angle.getAngleBetweenTwoPoints(
                    this.x, this.y, this.firing.x, this.firing.y
                );
                const velocity = Velocity.get2DVelocity(angle, t.projectileSpeed);
                const projectile = new Projectile({
                    x: this.x,
                    y: this.y,
                    rotation: -angle,
                    vx: velocity.x,
                    vy: velocity.y,
                    ttl: t.projectileLifetime,
                    onUpdate: t.projectileUpdate,
                    geometry: GEOMETRY.POINT,
                    onCollide: t.projectileCollide,
                    createdBy: this.id
                });

                this.lastShot = time;
                stage.addActor(projectile);
            });
        }

        if (this.type === 'player-base'){
            this.clearInactiveBuffs();
        }
    },
    defaultPlayerDamage: function(projectile, stage, damage){
        projectile = projectile || {};
        this.armor -= projectile.damage || damage;

        if (this.isDestroyed()){
            logger.info(`Actor(id=${this.id}, name=${this.name}) was destroyed`);

            if (this.type === "player-base"){
                this.x = 0;
                this.y = 0;
                this.armor = this.ship.get('maxArmor');

                this.isAccelerating = false;
                this.velocity = 0;
                this.rotateDirection = 0;

                //remove aggro for given player from all groups
                stage.removeAggro(this);

                if(projectile && projectile.createdBy){
                    PVP.doMath(
                        stage.getActorById(this.id).createdBy,
                        stage.getActorById(projectile.createdBy).createdBy
                    );
                }

                this.setBuff(BUFFS.DEATH, 1000 * 5);
            } else {
                stage.removeActorById(this.id);

                if (this.bounty && projectile && projectile.createdBy){
                    Transactions.createOne(
                        stage.getActorById(projectile.createdBy).createdBy,
                        this.bounty
                    );
                }
            }
        }

        if(this.type !== 'player-base' && projectile && projectile.createdBy){
            stage.addAggro(projectile.createdBy, this.isDestroyed() ? 33 : 9);
        }
    },
    morderDroneCollision: function(actor, stage){
        if (actor.type !== "player-base"){
            return;
        }

        this.onDamage(this, stage, 1000);

        if (typeof actor.onDamage === 'function'){
            actor.onDamage(this, stage, Math.round(Math.random() * 30 + 10));
        }
    }
}

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
        }

        this.target = null;

        this.setMethod(actions, options, 'onUpdate');
        this.setMethod(actions, options, 'onCollide');
        this.setMethod(actions, options, 'onDamage');
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
            type: this.type,
            size: this.size,
            name: this.name,
            kind: this.kind,
            target: this.target ? this.target.id : null,
            buffs: buffs.length === 0 ? undefined : buffs,
            ship: this.ship ? this.ship.kind : undefined
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
