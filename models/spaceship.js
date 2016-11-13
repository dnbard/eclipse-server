const Rigs = require('../db/rigs');

const RIGS = require('../enums/rigs');

function Spaceship(base, mods){
    this.base = base;
    this.mods = mods || {};

    this.rigs = (base.rigs || []).map(r => {
        return require(`../data/rigs/${r}.json`);
    });

    this.kind = base.kind;
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

module.exports = Spaceship;
