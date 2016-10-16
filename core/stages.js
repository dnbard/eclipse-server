"use strict";

const uuid = require('node-uuid').v4;

const Stage = require('../models/stage');
const Actor = require('../models/actor');
const Player = require('../models/player');

const GEOMETRY = require('../enums/geometry');

let collection = [];

exports.createStage = function(options){
    const stage = new Stage();
    stage.addActor(new Actor({
        kind: 'planet',
        geometry: GEOMETRY.CIRCLE,
        size: 118
    }));

    collection.push(stage);
    return stage;
}

exports.getOrCreateGeneric = function(){
    var stage = collection.filter(s => s.generic)[0] || exports.createStage();

    const npc = new Player({
        kind: 'player',
        type: 'npc-base',
        x: Math.random() * 1000,
        y: Math.random() * 1000,
        onUpdate: 'defaultPlayer',
        onDamage: 'defaultPlayerDamage',
        armor: 10,
        isAccelerating: true,
        rotateDirection: 1,
        geometry: GEOMETRY.CIRCLE,
        size: 16
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
