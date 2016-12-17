const Angle = require('../../../physics/angle');
const Velocity = require('../../../physics/velocity');
const Projectile = require('../../../models/projectile');
const Actions = require('../../../actions');

const GEOMETRY = require('../../../enums/geometry');

const TRESHOLD_PI = Math.PI * 0.99;
const ORBIT_RADIUS = 400;
const RATE_OF_FIRE = 400;

module.exports = function(stage, delta, time){
    const target = this.target;

    if (target){
        const distanceToTarget = Math.sqrt(
            Math.pow(target.x - this.x, 2) +
            Math.pow(target.y - this.y, 2)
        );

        if (distanceToTarget < ORBIT_RADIUS){
            this.rotateDirection = this.rotateDirection || Math.random() > 0.5 ? 1 : -1;
        } else {
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

            this.rotateDirection = 0;
        }

        if (!this.lastShot || time - this.lastShot > RATE_OF_FIRE){
            const shotX = target.x + Math.random() * 16 - 8;
            const shotY = target.y + Math.random() * 16 - 8;

            const angle = Angle.getAngleBetweenTwoPoints(
                this.x, this.y, shotX, shotY
            );
            const velocity = Velocity.get2DVelocity(angle, 40);
            const projectile = new Projectile({
                x: this.x - velocity.x,
                y: this.y - velocity.y,
                rotation: -angle,
                vx: velocity.x,
                vy: velocity.y,
                ttl: 1200,
                onUpdate: Actions.getAction('projectile/default'),
                geometry: GEOMETRY.POINT,
                onCollide: Actions.getAction('projectile/defaultCollision'),
                createdBy: this.id,
                type: 'mining',
                damageMin: 4,
                damageMax: 9,
                groupId: this.groupId || undefined
            });

            this.lastShot = time;
            stage.addActor(projectile);
        }
    } else if (this.rotateDirection === 0) {
        this.rotateDirection = Math.random() > 0.5 ? 1 : -1;
    }
}
