module.exports = function(stage, delta){
    this.x += this.vx;
    this.y += this.vy;

    if (this.ttl){
        this.ttl -= delta;

        if (this.ttl <= 0){
            stage.removeActorById(this.id);
        }
    }
}
