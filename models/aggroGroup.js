const _ = require('lodash');

const idGenerator = require('../core/uuid');

function AggroGroup(options){
    options = options || {};

    this.id = idGenerator();

    this.actors = options.actors || [];
    this.stage = options.stage;
    this.aggroList = [];

    this.actors.forEach(a => AggroGroup.addToStage(a, this.stage));

    //this method should be called in the end of constructor
    this.createJSONView();
}

//this method should be called after ANY change in Aggro Group
AggroGroup.prototype.createJSONView = function(){
    this.JSONView = {
        id: this.id,
        actors: this.actors.map(a => a.id),
        stage: this.stage.id,
        aggroList: this.aggroList
    };
}

AggroGroup.prototype.toJSON = function(){
    return this.JSONView;
}

AggroGroup.prototype.onUpdate = function(){
    if (this.actors.length === 0){
        return this.stage.removeGroupById(this.id);
    }

    const isGroupChanged = !!_.remove(this.actors, AggroGroup._actorsRemover);

    if (isGroupChanged){
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
