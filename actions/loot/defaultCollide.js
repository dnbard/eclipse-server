const Rig = require('../../db/rigs');

module.exports = function(actor, stage){
    if (actor.kind === 'player' && actor.type === 'player-base'){
        stage.removeActorById(this.id);

        Rig.createOrStack({
            ownedBy: actor.createdBy,
            storedIn: actor.ship.id,
            kind: this.loot.id,
            name: this.loot.name,
            quantity: Math.round(
                this.quantityMod * (
                    Math.random() * (this.loot.quantity.max - this.loot.quantity.min) + this.loot.quantity.min
                )
            )
        });
    }
}
