const Player = require('../models/player');
const Spaceship = require('../models/spaceship');

const GEOMETRY = require('../enums/geometry');


function createOne(options){
    options = options || {};

    return new Player({
        kind: 'player',
        type: 'npc-base',
        x: (options.x || 0) + Math.random() * 100 - 50,
        y: (options.y || 0) + Math.random() * 100 - 50,
        onUpdate: [ 'npc/hammerhead/hammerheadUpdate', 'npc/defaultUpdate', 'pc/defaultUpdate' ],
        onDamage: 'pc/defaultDamage',
        onCollide: 'npc/suicideCollide',
        armor: Math.ceil(Math.random() * 25),
        isAccelerating: true,
        rotateDirection: Math.random() > 0.5 ? 1 : -1,
        geometry: GEOMETRY.CIRCLE,
        size: 28,
        name: 'Hammerhead',
        bounty: 200,
        ship: new Spaceship(require('../data/ships/hammerhead'), {})
    });
}

function createFew(options){
    options = options || {};

    const seed = Math.random() * Math.PI * 2 - Math.PI;
    const radius = Math.random() * 1000 + 450;

    const newOptions = {
        x: options.x || (Math.sin(seed) * radius),
        y: options.y || (Math.cos(seed) * radius)
    };

    return Array.apply(null, Array(options.quantity || 2))
        .map(() => createOne(newOptions));
}


exports.createOne = createOne;
exports.createFew = createFew;
