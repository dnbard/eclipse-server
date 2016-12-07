const Angle = require('../../../physics/angle');

const TRESHOLD_PI = Math.PI * 0.99;

module.exports = function(){
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
}
