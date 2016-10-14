"use strict";

const uuid = require('node-uuid').v4;

const Stage = require('../models/stage');
const Actor = require('../models/actor');

let collection = [];

exports.createStage = function(options){
    const stage = new Stage();
    stage.addActor(new Actor({
        kind: 'planet'
    }));

    collection.push(stage);
    return stage;
}

exports.getOrCreateGeneric = function(){
    var stage = collection.filter(s => s.generic)[0] || exports.createStage();

    const npc = new Actor({
        kind: 'player',
        type: 'npc-base',
        x: Math.random() * 1000,
        y: Math.random() * 1000,
        onUpdate: 'defaultPlayer',
        isAccelerating: true,
        rotateDirection: 1
    });

    stage.addActor(npc);

    return stage ;
}

exports.removeAll = function(){
    collection = [];
}

exports.length = function(){
    return collection.length;
}

exports.getCollection = function(){
    return collection;
}
