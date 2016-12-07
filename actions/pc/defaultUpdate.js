const Velocity = require('../../physics/velocity');
const Angle = require('../../physics/angle');
const Projectile = require('../../models/projectile');

const GEOMETRY = require('../../enums/geometry');


module.exports = function(stage, delta, time){
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
                createdBy: this.id,
                type: t.projectileKind,
                damageMin: t.projectileMinDamage,
                damageMax: t.projectileMaxDamage
            });

            this.lastShot = time;
            stage.addActor(projectile);
        });
    }

    if (this.type === 'player-base'){
        this.clearInactiveBuffs();
    }
}
