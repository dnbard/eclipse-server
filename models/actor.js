"use strict";

const uuid = require('node-uuid').v4;
const _ = require('lodash');

class Actor{
    constructor(options){
        options = options || {};

        this.id = uuid();

        this.x = options.x || 0;
        this.y = options.y || 0;
        this.rotation = 0;

        this.kind = options.kind || 'actor';

        if (typeof options.onUpdate === 'function'){
            this.onUpdate = options.onUpdate;
        }
    }
}

module.exports = Actor;
