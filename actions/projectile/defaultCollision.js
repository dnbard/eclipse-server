module.exports = function(actor, stage){
    if(actor.id === this.createdBy){
        return;
    }

    stage.removeActorById(this.id);

    if (typeof actor.onDamage === 'function'){
        actor.onDamage(this, stage);
    }
}
