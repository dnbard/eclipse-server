"use strict";

const uuid = require('./uuid');

const Stage = require('../models/stage');
const StagesData = require('../data/stages');
const Actor = require('../models/actor');
const Player = require('../models/player');
const Asteroid = require('../models/asteroid');

const GEOMETRY = require('../enums/geometry');

let collection = [];

//obsolete
exports.createStage = function(options){
    const stage = new Stage();
    stage.addActor(new Actor({
        kind: 'planet',
        geometry: GEOMETRY.CIRCLE,
        size: 118
    }));

    for(var i = 0; i < 15; i ++){
        var asteroid = new Asteroid({
            x: Math.random() * 800 - 400,
            y: Math.random() * 900 - 1000,
        });
        stage.addActor(asteroid);
    }

    collection.push(stage);
    return stage;
}

function createNPCs(quantity){
    const x = Math.random() * 2000 - 1000;
    const y = Math.random() * 2000 - 1000;

    return Array.apply(null, Array(quantity)).map(() => {
        return new Player({
            kind: 'player',
            type: 'npc-base',
            x: x + Math.random() * 100,
            y: y + Math.random() * 100,
            onUpdate: 'morderDroneUpdate',
            onDamage: 'defaultPlayerDamage',
            onCollide: 'morderDroneCollision',
            armor: Math.round(Math.random() * 25),
            isAccelerating: true,
            rotateDirection: Math.random() > 0.5 ? 1 : -1,
            geometry: GEOMETRY.CIRCLE,
            size: 16,
            name: 'Morder Drone'
        });
    });
}

exports.createAllStages = function(){
    StagesData.forEach(data => {
        const stage = new Stage(data);

        if (typeof data.onCreate === 'function'){
            data.onCreate.call(stage, stage);
        }

        collection.push(stage);
    });
}

exports.getOrCreateGeneric = function(){
    if(collection.length === 0){
        exports.createAllStages();
    }

    const stage = collection.filter(s => s.generic)[0];

    //stage.createGroup(createNPCs(4));

    return stage;
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
