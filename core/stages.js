"use strict";

const _ = require('lodash');

const uuid = require('./uuid');
const Stage = require('../models/stage');
const StagesData = require('../data/stages');
// const Actor = require('../models/actor');
// const Asteroid = require('../models/asteroid');
const MorderDroneGenerator = require('../generators/npcMorder');
const Scheduler = require('../core/scheduler');

const GEOMETRY = require('../enums/geometry');

//TODO: to change it to binary tree
let collection = [];

//obsolete
// exports.createStage = function(options){
//     const stage = new Stage();
//     stage.addActor(new Actor({
//         kind: 'planet',
//         geometry: GEOMETRY.CIRCLE,
//         size: 118
//     }));
//
//     for(var i = 0; i < 15; i ++){
//         var asteroid = new Asteroid({
//             x: Math.random() * 800 - 400,
//             y: Math.random() * 900 - 1000,
//         });
//         stage.addActor(asteroid);
//     }
//
//     collection.push(stage);
//     return stage;
// }

exports.createAllStages = function(){
    StagesData.forEach(data => {
        const stage = new Stage(data);

        if (typeof data.onCreate === 'function'){
            data.onCreate.call(stage, stage);
        }

        collection.push(stage);
    });
}

function createMorderDroneGroup(stage){
    const group = stage.createGroup(MorderDroneGenerator.createFew({
        quantity: Math.round(Math.random() * 5) + 1
    }));

    group.onDestroy = function(){
        Scheduler.schedule(() => createMorderDroneGroup(stage),
            Math.round(Math.random() * 10000));
    }
}

exports.getOrCreateGeneric = function(){
    if(collection.length === 0){
        exports.createAllStages();
    }

    const stage = collection.filter(s => s.generic)[0];
    createMorderDroneGroup(stage);

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

exports.getOneById = function(id){
    return _.find(collection, s => s.id === id);
}
