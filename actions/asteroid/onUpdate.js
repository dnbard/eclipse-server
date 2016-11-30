const ANGLE_DELTA = 0.0015;

module.exports = function(){
    if (this.globalRotationAngle){
        this.globalRotationAngle += this.globalRotationAngleDelta;

        if (this.globalRotationAngle > Math.PI * 2){
            this.globalRotationAngle -= Math.PI * 2;
        }

        //TODO: change me for all asteroids that rotating not around 0:0
        this.globalRotationRadius = Math.sqrt(this.x * this.x + this.y * this.y);

        const dx = Math.cos(this.globalRotationAngle) * this.globalRotationRadius - this.x;
        const dy = Math.sin(this.globalRotationAngle) * this.globalRotationRadius - this.y;

        this.x += dx;
        this.y += dy;
    }

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
