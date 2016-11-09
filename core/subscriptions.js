'use strict';

const debug = require('debug')('subscriptions');
const _ = require('lodash');
const uuid = require('./uuid');

let subscriptionsBySubscriberMap = new Map();
let subscriptionsBySubscribeToMap = new Map();
let subscriptionsByIdMap = new Map();

exports.createSubscription = function(subscriber, subscribeTo, ws) {
    let subscriptionsBySubscriber = subscriptionsBySubscriberMap.get(subscriber) || [];
    let subscriptionsBySubscribeTo = subscriptionsBySubscribeToMap.get(subscribeTo) || [];

    const subscription = {
        id: uuid(),
        subscriber: subscriber,
        subscribeTo: subscribeTo,
        ws: ws,
        toJSON: toJSON
    };

    subscriptionsBySubscriber.push(subscription);
    subscriptionsBySubscribeTo.push(subscription);

    subscriptionsBySubscriberMap.set(subscriber, subscriptionsBySubscriber);
    subscriptionsBySubscribeToMap.set(subscribeTo, subscriptionsBySubscribeTo);
    subscriptionsByIdMap.set(subscription.id, subscription);

    debug(`Subscription (id=${subscription.id}, subscriber=${subscriber}) created`);

    return subscription;
}

exports.getSubscriptionBySubscriberId = function(subscriberId){
    return (subscriptionsBySubscriberMap.get(subscriberId) || []);
}

exports.getSubscriptionBySubscribeToId = function(subscribeTo){
    return (subscriptionsBySubscribeToMap.get(subscribeTo) || []);
}

exports.removeSubscriptionById = function(subscriptionId){
    let subscription = subscriptionsByIdMap.get(subscriptionId);

    if (!subscription) {
        return;
    }

    let subscriber = subscription.subscriber;
    let subscribeTo = subscription.subscribeTo;
    let subscriptionsBySubscriber = subscriptionsBySubscriberMap.get(subscriber);
    let subscriptionsBySubscribeTo = subscriptionsBySubscribeToMap.get(subscribeTo);

    _.remove(subscriptionsBySubscriber, s => s.id === subscriptionId);
    _.remove(subscriptionsBySubscribeTo, s => s.id === subscriptionId);

    if (subscriptionsBySubscriber.length === 0) {
        subscriptionsBySubscriberMap.delete(subscriber);
    }

    if (subscriptionsBySubscribeTo.length === 0) {
        subscriptionsBySubscribeToMap.delete(subscribeTo);
    }

    subscriptionsByIdMap.delete(subscriptionId);

    debug(`Subscriptions (id=${subscriptionId} removed)`);
}

exports.removeSubscriptionBySubscriberId = function(subscriberId) {
    let subscriptionsBySubscriber = subscriptionsBySubscriberMap.get(subscriberId);

    if (!subscriptionsBySubscriber) {
        return;
    }

    subscriptionsBySubscriber.forEach(subscription => {
        let subscribeTo = subscription.subscribeTo;
        let subscriptionsBySubscribeTo = subscriptionsBySubscribeToMap.get(subscribeTo);

        _.remove(subscriptionsBySubscribeTo, s => s.subscriber === subscriberId);

        if (subscriptionsBySubscribeTo.length === 0) {
            subscriptionsBySubscribeToMap.delete(subscribeTo);
        }

        subscriptionsByIdMap.delete(subscription.id);
    });

    subscriptionsBySubscriberMap.delete(subscriberId);

    debug(`Subscriptions (subscriberId=${subscriberId} removed)`);
}

exports.removeAll = function() {
    subscriptionsBySubscriberMap.clear();
    subscriptionsBySubscribeToMap.clear();
    subscriptionsByIdMap.clear();
}

function toJSON(){
    return Object.assign({}, this, { ws: undefined });
}
