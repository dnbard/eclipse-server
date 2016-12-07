"use strict";

const _ = require('lodash');

const uuid = require('./uuid');
const Stage = require('../models/stage');
const StagesData = require('../data/stages');
// const Actor = require('../models/actor');
// const Asteroid = require('../models/asteroid');
const MorderDroneGenerator = require('../generators/npcMorder');
const HammerheadGenerator = require('../generators/npcHammerhead');
const Scheduler = require('../core/scheduler');

const GEOMETRY = require('../enums/geometry');

//TODO: to change it to binary tree
let collection = [];

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

function createHammerheadGroup(stage){
    const group = stage.createGroup(HammerheadGenerator.createFew({
        quantity: Math.round(Math.random() * 5) + 1
    }));

    group.onDestroy = function(){
        Scheduler.schedule(() => createHammerheadGroup(stage),
            Math.round(Math.random() * 10000));
    }
}

exports.getOrCreateGeneric = function(){
    if(collection.length === 0){
        exports.createAllStages();
    }

    const stage = collection.filter(s => s.generic)[0];
    createMorderDroneGroup(stage);
    createHammerheadGroup(stage);

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
