function Spaceship(base, mods){
    this.base = base;
    this.mods = mods || {};

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

module.exports = Spaceship;
