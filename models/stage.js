const _ = require('lodash');

const uuid = require('../core/uuid');
const AggroGroup = require('../models/aggroGroup')

function Stage(options){
    this.id = uuid();

    this.actors = [];

    this.generic = true;

    this.groups = [];
}

Stage.prototype.addActor = function(actor){
    this.actors.push(actor);
}

Stage.prototype.removeActorById = function(actorId){
    _.remove(this.actors, a => a.id === actorId);
}

Stage.prototype.createGroup = function(actors){
    const group = new AggroGroup({
        actors: actors || [],
        stage: this
    });
    this.addGroup(group);
    return group;
}

Stage.prototype.addGroup = function(group){
    this.groups.push(group);
}

Stage.prototype.removeGroupById = function(groupId){
    _.remove(this.groups, g => g.id === groupId);
}

module.exports = Stage;
