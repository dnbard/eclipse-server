const _ = require('lodash');

const Rigs = require('../db/rigs');
const RIGS = require('../enums/rigs');

function Spaceship(base, mods, id){
    this.base = base;
    this.mods = mods || {};

    this.rigs = (base.rigs || []).map(r => {
        return require(`../data/rigs/${r}.json`);
    });

    this.kind = base.kind;

    this.id = id || null;
}

Spaceship.prototype.get = function(key){
    const baseValue = this.base[key];
    const modValue = this.mods[key];

    if (typeof baseValue === 'number' && typeof modValue === 'number'){
        return baseValue + modValue;
    }

    return baseValue;
}

Spaceship.prototype.getTurrets = function(){
    return this.rigs.filter(r => r.kind === RIGS.TURRET);
}

Spaceship.prototype.equip = function(rigId){
    this.rigs.push(require(`../data/rigs/${rigId}.json`));
}

Spaceship.prototype.unequip = function(rigId){
    const rigIndex = _.findIndex(this.rigs, { id: rigId });

    if (rigIndex >= 0){
        this.rigs.splice(rigIndex, 1);
    }
}

module.exports = Spaceship;
