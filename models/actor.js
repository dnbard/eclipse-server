"use strict";

const _ = require('lodash');

const uuid = require('../core/uuid');
const Time = require('../core/time');

const actions = {};

class Actor{
    constructor(options){
        options = options || {};

        this.id = uuid();

        this.x = options.x || 0;
        this.y = options.y || 0;
        this.rotation = options.rotation || 0;

        this.isAccelerating = options.isAccelerating || false;
        this.rotateDirection = options.rotateDirection || 0;

        this.velocity = 0;
        this.vx = options.vx;
        this.vy = options.vy;

        this.ttl = options.ttl || 0;

        this.type = options.type || null;

        this.kind = options.kind || 'actor';

        this.name = options.name;

        this.geometry = options.geometry || null;
        this.size = options.size || 0;
        this.createdBy = options.createdBy || null;

        this.setMethod(actions, options, 'onUpdate');
        this.setMethod(actions, options, 'onCollide');
        this.setMethod(actions, options, 'onDamage');

        this.groupId = null;

        this.buffs = {};
    }

    setMethod(methods, options, name){
        if (options === undefined){
            return;
        }

        if (typeof options[name] === 'function'){
            this[name] = options[name];
        } else if (typeof options[name] === 'string'){
            this[name] = methods[options[name]];
        }
    }

    toJSON(){
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            armot: this.armor,
            maxArmor: this.maxArmor,
            type: this.type,
            size: this.size,
            name: this.name,
            kind: this.kind
        }
    }

    isDestroyed(){
        return false;
    }

    toFixed(value, precision) {
        var power = Math.pow(10, precision || 0);
        return Math.round(value * power) / power;
    }

    setBuff(buffName, duration){
        this.buffs[buffName] = Time.get() + duration;
    }

    isBuffActive(buffName){
        const buffDuration = this.buffs[buffName];
        return !!buffDuration && buffDuration > Time.get();
    }

    removeBuff(buffName){
        this.buffs[buffName] = undefined;
    }

    clearInactiveBuffs(){
        const time = Time.get();
        _.each(this.buffs, (durration, key) => {
            if (durration < time){
                delete this.buffs[key];
            };
        });
    }
}

module.exports = Actor;
