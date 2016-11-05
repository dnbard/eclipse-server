const Player = require('../models/player');

const GEOMETRY = require('../enums/geometry');


function createOne(options){
    options = options || {};

    return new Player({
        kind: 'player',
        type: 'npc-base',
        x: (options.x || 0) + Math.random() * 100,
        y: (options.y || 0) + Math.random() * 100,
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
}

function createFew(options){
    options = options || {};

    const newOptions = {
        x: options.x || (Math.random() * 2000 - 1000),
        y: options.y || (Math.random() * 2000 - 1000)
    };

    return Array.apply(null, Array(options.quantity || 4))
        .map(() => createOne(newOptions));
}


exports.createOne = createOne;
exports.createFew = createFew;
