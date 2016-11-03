"use strict";

const pako = require('pako');

const LOOP_DELTA = 27;
const AGRO_LOOP_DELTA = 2999;
const UPDATE_DELTA = 100;
const SCHEDULER_DELTA = 1000;

const Stages = require('../core/stages');
const Subscriptions = require('../core/subscriptions');
const EVENTS = require('../public/scripts/enums/events');
const WebSokets = require('../core/ws');
const Collision = require('../core/collision');
const Scheduler = require('../core/scheduler');

let TIME = 0;
let SYNC_COUNTER = 0;

exports.init = function(){
    let stage = Stages.getOrCreateGeneric();

    console.log('Update Loop :: initialized');
    setTimeout(LoopIterator, LOOP_DELTA);

    console.log('WS Update Loop :: initialized');
    setTimeout(WSUpdateIterator, UPDATE_DELTA);

    console.log('Aggro Detection Loop :: initialized');
    setTimeout(AggroLoopIterator, AGRO_LOOP_DELTA);

    console.log('Scheduler Loop :: initialized');
    setTimeout(SchedulerIterator, SCHEDULER_DELTA);

    function LoopIterator(){
        setTimeout(LoopIterator, LOOP_DELTA);

        TIME += LOOP_DELTA;

        if (!stage){
            return;
        }

        const actors = stage.actors;
        actors.forEach(ActorIterator);

        Collision.checkStage(stage);
    }

    function AggroLoopIterator(){
        setTimeout(AggroLoopIterator, AGRO_LOOP_DELTA);

        if (!stage){
            return;
        }

        const groups = stage.groups;
        groups.forEach(ActorIterator);
    }

    function ActorIterator(actor){
        if (typeof actor !== 'object' || !actor){
            return;
        }

        if (typeof actor.onUpdate === 'function'){
            actor.onUpdate.call(actor, stage, LOOP_DELTA, TIME);
        }
    }

    function WSUpdateIterator(){
        setTimeout(WSUpdateIterator, UPDATE_DELTA);

        if (!stage){
            return;
        }

        const stageId = stage.id;
        const message = JSON.stringify({
            id: SYNC_COUNTER++,
            subject: EVENTS.STAGE.UPDATED,
            message: { stage: stage }
        });

        const binaryString = pako.deflate(message, { to: 'string' });

        Subscriptions.getSubscriptionBySubscribeToId(stageId)
            .forEach(s => WebSokets.sendMessage(s.ws, binaryString, {
                packed: true
            }));

        if (SYNC_COUNTER > 100000000){
            SYNC_COUNTER = 0;
        }
    }

    function SchedulerIterator(){
        setTimeout(SchedulerIterator, SCHEDULER_DELTA);

        Scheduler.update(TIME);
    }
}
