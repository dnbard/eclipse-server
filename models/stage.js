const uuid = require('../core/uuid');
const _ = require('lodash');

function Stage(options){
    this.id = uuid();

    this.actors = [];

    this.generic = true;
}

Stage.prototype.addActor = function(actor){
    this.actors.push(actor);
}

Stage.prototype.removeActorById = function(actorId){
    _.remove(this.actors, a => a.id === actorId);
}

module.exports = Stage;
