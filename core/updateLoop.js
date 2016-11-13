"use strict";

const pako = require('pako');
const now = require('performance-now');
const debug = require('debug')('core:update');

const LOOP_DELTA = 27;
const AGRO_LOOP_DELTA = 2999;
const UPDATE_DELTA = 100;
const SCHEDULER_DELTA = 1000;
const TRANSACTIONS_DELTA = 20000;

const logger = require('./logger').child({widget_type: 'updateLoop'});
const Stages = require('../core/stages');
const Subscriptions = require('../core/subscriptions');
const EVENTS = require('../public/scripts/enums/events');
const WebSokets = require('../core/ws');
const Collision = require('../core/collision');
const Scheduler = require('../core/scheduler');
const Transactions = require('../core/transactions');
const Time = require('../core/time');

let SYNC_COUNTER = 0;

exports.init = function(){
    let stage = Stages.getOrCreateGeneric();

    logger.info('Update Loop :: initialized');
    setTimeout(LoopIterator, LOOP_DELTA);

    logger.info('WS Update Loop :: initialized');
    setTimeout(WSUpdateIterator, UPDATE_DELTA);

    logger.info('Aggro Detection Loop :: initialized');
    setTimeout(AggroLoopIterator, AGRO_LOOP_DELTA);

    logger.info('Scheduler Loop :: initialized');
    setTimeout(SchedulerIterator, SCHEDULER_DELTA);

    logger.info('Transactions Loop :: initialized');
    setTimeout(TransactionsIterator, TRANSACTIONS_DELTA);

    function LoopIterator(){
        const start = now();

        setTimeout(LoopIterator, LOOP_DELTA);

        Time.increment(LOOP_DELTA);

        if (!stage){
            return;
        }

        const actors = stage.actors;
        actors.forEach(ActorIterator);

        Collision.checkStage(stage);

        const end = now();
        debug(`Update took: ${(end-start).toFixed(3)}ms`);
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
            const TIME = Time.get();
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
        Scheduler.update(Time.get());
    }

    function TransactionsIterator(){
        setTimeout(TransactionsIterator, TRANSACTIONS_DELTA);
        Transactions.update(Time.get());
    }
}
