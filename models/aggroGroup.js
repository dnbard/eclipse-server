const _ = require('lodash');

const idGenerator = require('../core/uuid');
const Collision = require('../core/collision');

const BUFFS = require('../enums/buffs');

const AGGRO_RADIUS = 1000;

function AggroGroup(options){
    options = options || {};

    this.id = idGenerator();

    this.actors = options.actors || [];
    this.stage = options.stage;
    this.aggroList = [];

    this.onDestroy = options.onDestroy || null;

    this.actors.forEach(a => AggroGroup.addToStage(a, this.stage));

    //this method should be called in the end of constructor
    this.createJSONView();
}

//this method should be called after ANY change in Aggro Group
AggroGroup.prototype.createJSONView = function(){
    this.JSONView = {
        id: this.id,
        actors: this.actors.map(a => a.id),
        stage: this.stage.id
    };
}

AggroGroup.prototype.toJSON = function(){
    return this.JSONView;
}

AggroGroup.prototype._playerByType = function(a){
    return a.type === 'player-base';
}

AggroGroup.prototype.getAggroElement = function(id){
    return this.aggroList.find(el => el.id === id);
}

AggroGroup.prototype.createAggroElement = function(target){
    return {
        id: target.id,
        target: target,
        value: 0
    }
}

AggroGroup.prototype.addAggro = function(entityId, value){
    const entity = _.find(this.aggroList, e => e.id === entityId);

    if (entity){
        entity.value += value;
    }
}

AggroGroup.prototype.removeAggro = function(entity){
    _.remove(this.aggroList, e => e.id === entity.id);
}

AggroGroup.prototype.onUpdate = function(){
    if (this.actors.length === 0){
        if (typeof this.onDestroy === 'function'){
            this.onDestroy.apply(this, arguments);
        }

        return this.stage.removeGroupById(this.id);
    }

    const isGroupChanged = _.remove(this.actors, AggroGroup._actorsRemover).length;

    const players = this.stage.actors.filter(this._playerByType);
    players.forEach(p => {
        if (p.isBuffActive(BUFFS.SANCTUARY)){
            return;
        }

        this.actors.forEach(a => {
            var aggroElement = this.getAggroElement(p.id);

            if (Collision.nonActorCircleCircleCollider(
                p.x, p.y, p.size, a.x, a.y, AGGRO_RADIUS
            )){
                if (!aggroElement){
                    aggroElement = this.createAggroElement(p);
                    this.aggroList.push(aggroElement);
                }
                aggroElement.value += 1;
            }
        });
    });

    if (this.aggroList.length > 0){
        const maxAggro = _.maxBy(this.aggroList, 'value');
        if (maxAggro){
            this.actors.forEach(a => a.target = maxAggro.target);
        }
    } else {
        this.actors.forEach(a => a.target = null);
    }

    if (isGroupChanged){
        console.log(`Aggro Group(id=${this.id}) was changed: ${isGroupChanged} actors were removed`);
        this.createJSONView();
    }
}

AggroGroup.addToStage = function(actor, stage){
    stage.addActor(actor);
}

AggroGroup._actorsRemover = function(actor){
    return actor.isDestroyed();
}

module.exports = AggroGroup;
