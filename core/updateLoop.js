"use strict";

const LOOP_DELTA = 25;
const UPDATE_DELTA = 100;

const Stages = require('../core/stages');
const Subscriptions = require('../core/subscriptions');
const EVENTS = require('../public/scripts/enums/events');
const WebSokets = require('../core/ws');
const Collision = require('../core/collision');

let TIME = 0;

exports.init = function(){
    let stage = Stages.getOrCreateGeneric();
    setTimeout(LoopIterator, LOOP_DELTA);
    setTimeout(UpdateIterator, UPDATE_DELTA);

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

    function ActorIterator(actor){
        if (typeof actor !== 'object' || !actor){
            return;
        }

        if (typeof actor.onUpdate === 'function'){
            actor.onUpdate.call(actor, stage, LOOP_DELTA, TIME);
        }
    }

    function UpdateIterator(){
        setTimeout(UpdateIterator, UPDATE_DELTA);

        if (!stage){
            return;
        }

        const stageId = stage.id;
        const message = JSON.stringify({
            subject: EVENTS.STAGE.UPDATED,
            message: { stage: stage }
        });

        Subscriptions.getSubscriptionBySubscribeToId(stageId)
            .forEach(s => WebSokets.sendMessage(s.ws, message));
    }
}
