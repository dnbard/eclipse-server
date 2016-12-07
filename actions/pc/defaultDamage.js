const logger = require('../../core/logger')
    .child({widget_type: 'player-default_damage'});
const PVP = require('../../core/pvp');
const Transactions = require('../../core/transactions');

const BUFFS = require('../../enums/buffs');

module.exports = function(projectile, stage, damage){
    projectile = projectile || {};
    this.armor -= projectile.damage || damage;

    if (this.isDestroyed()){
        logger.info(`Actor(id=${this.id}, name=${this.name}) was destroyed`);

        if (this.type === "player-base"){
            this.x = 0;
            this.y = 0;
            this.armor = this.ship.get('maxArmor');

            this.isAccelerating = false;
            this.velocity = 0;
            this.rotateDirection = 0;

            //remove aggro for given player from all groups
            stage.removeAggro(this);

            if(projectile && projectile.createdBy){
                PVP.doMath(
                    stage.getActorById(this.id).createdBy,
                    stage.getActorById(projectile.createdBy).createdBy
                );
            }

            this.setBuff(BUFFS.DEATH, 1000 * 5);
        } else {
            stage.removeActorById(this.id);

            if (this.bounty && projectile && projectile.createdBy){
                const player = stage.getActorById(projectile.createdBy);
                const playerId = player ? player.createdBy : null;
                if (playerId){
                    Transactions.createOne(playerId, this.bounty);
                }
            }
        }
    }

    if(this.type !== 'player-base' && projectile && projectile.createdBy){
        stage.addAggro(projectile.createdBy, this.isDestroyed() ? 33 : 9);
    }
}
