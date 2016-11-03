"use strict";

const SortedArray = require('sorted-array');
const uuid = require('node-uuid').v4;

const comparator = (e) => e.ttl;
var events = SortedArray.comparing(comparator, []);
var timestamp = 0;

class ScheduledEvent{
    constructor(event){
        event = event || {};

        this.id = uuid();
        this.ttl = timestamp + (event.ttl || 0);
        this.handler = event.handler || null;
        this.args = event.args || undefined;
    }

    execute(){
        this.handler.call(this, this.args);
    }

    remove(){
        events.remove(this);
    }
}

exports.schedule = function(){
    var event = null;

    if (arguments.length === 1){
        event = arguments[0];
    } else if (arguments.length === 2){
        event = {
            ttl: arguments[1],
            handler: arguments[0]
        }
    } else {
        throw new TypeError('Invalid or empty variables');
    }

    const e = new ScheduledEvent(event);

    events.insert(e);

    return e;
}

exports.update = function(newTimestamp){
    var el = getFirst();

    while (typeof el === 'object' && el.ttl < newTimestamp){
        el.remove();
        el.execute();

        el = getFirst();
    }

    timestamp = newTimestamp;
}

exports.removeAll = function(){
    events = SortedArray.comparing(comparator, []);
    timestamp = 0;
}

exports.getAll = function(){
    return events.array;
}

function getFirst(){
    return events.array[0];
}
