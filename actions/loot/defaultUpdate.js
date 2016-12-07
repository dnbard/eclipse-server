const THRESHOLD = 0.9;

module.exports = function(){
    this.rotation += this.rotationSpeed;

    if (this.vx !== 0 || this.vy !== 0){
        this.x += this.vx;
        this.y += this.vy;

        this.vx *= THRESHOLD;
        this.vy *= THRESHOLD;

        if (this.vx < THRESHOLD){
            this.vx = 0;
        }

        if (this.vy < THRESHOLD){
            this.vy = 0;
        }
    }
}
