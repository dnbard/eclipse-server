const COLLISION_VELOCITY = 3;

module.exports = function(actor, stage){
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
