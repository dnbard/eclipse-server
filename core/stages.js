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
    var stage = collection.filter(s => s.generic)[0];

    return stage || exports.createStage();
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
