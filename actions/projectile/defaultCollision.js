module.exports = function(actor, stage){
    if(actor.id === this.createdBy || (this.groupId && this.groupId === actor.groupId)){
        return;
    }

    stage.removeActorById(this.id);

    if (typeof actor.onDamage === 'function'){
        actor.onDamage(this, stage);
    }
}
