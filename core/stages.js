const uuid = require('node-uuid').v4;

const Stage = require('../models/stage');

var collection = [];

exports.createStage = function(options){
    const stage = new Stage();
    stage.addActor({
        kind: 'planet',
        x: 0,
        y: 0,
        id: uuid()
    });


    collection.push(stage);
    return stage;
}

exports.getOrCreateGeneric = function(){
    var stage = collection.filter(s => s.generic)[0];

    return stage || exports.createStage();
}

exports.removeAll = function(){
    collection = [];
}

exports.length = function(){
    return collection.length;
}
