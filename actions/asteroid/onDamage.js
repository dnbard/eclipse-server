const Minerals = require('../../data/rigs/minerals.json');
const Loot = require('../../models/loot');

module.exports = function(actor, stage){
    this.armor --;

    if (this.armor <= 0){
        stage.removeActorById(this.id);

        const quantity = Math.ceil(Math.random() * 4);
        const lootObject = {
            x: this.x,
            y: this.y,
            loot: Minerals.chrondite,
            quantityMod: actor.kind === 'projectile' && actor.type === 'mining' ? 4 : 1
        };

        for (var i = 0; i < quantity; i++){
            var loot = new Loot(lootObject);
            stage.addActor(loot);
        }
    }
}
