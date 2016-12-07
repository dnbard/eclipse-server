module.exports = function(actor, stage){
    if (actor.type !== "player-base"){
        return;
    }

    this.onDamage(this, stage, 1000);

    if (typeof actor.onDamage === 'function'){
        actor.onDamage(this, stage, Math.round(Math.random() * 30 + 10));
    }
}
