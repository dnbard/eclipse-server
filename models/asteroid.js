"use strict";

const Actor = require('./actor');
const AsteroidsMetadata = require('../public/images/asteroids/asteroids.json');

const GEOMETRY = require('../enums/geometry');

function onUpdate(){
    this.rotation += 0.01;
}

const types = [
    'gray01',
    'gray02',
    'gray03'
];

class Asteroid extends Actor{
    constructor(options){
        super(options);

        const asteroidData = AsteroidsMetadata[Math.trunc(Math.random() * AsteroidsMetadata.length)];

        this.kind = 'asteroid';
        this.type = asteroidData.filename;
        this.size = asteroidData.width;
        this.geometry = GEOMETRY.CIRCLE;

        this.onUpdate = onUpdate;
    }
}

module.exports = Asteroid;
