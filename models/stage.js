const _ = require('lodash');

const uuid = require('../core/uuid');
const AggroGroup = require('../models/aggroGroup')

function Stage(options){
    options = options || {};

    this.id = options.id || uuid();
    this.name = options.name || this.generateName();

    this.actors = [];

    this.generic = true;

    this.groups = [];
}

Stage.prototype.generateName = function(){
    const name = Math.round((Math.random() * Math.pow(10, Math.round(Math.random() * 3) + 5)))
        .toString(36)
        .toUpperCase()
        .split('');

    if (Math.random() > 0.42)
        name.splice(Math.ceil(Math.random() * (name.length - 2) + 1), 0, '-');

    return name.join('');
}

Stage.prototype.addActor = function(actor){
    this.actors.push(actor);
}

Stage.prototype.removeActorById = function(actorId){
    _.remove(this.actors, a => a.id === actorId);
}

Stage.prototype.getActorById = function(actorId){
    return _.find(this.actors, a => a.id === actorId);
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

Stage.prototype.removeAggro = function(entity){
    if (!entity || typeof entity !== 'object' || typeof entity.id !== 'string'){
        throw new TypeError('"entity" should be valid object');
    }

    this.groups.forEach(g => g.removeAggro(entity));
}

module.exports = Stage;
