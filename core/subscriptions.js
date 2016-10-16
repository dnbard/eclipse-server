const uuid = require('./uuid');
const _ = require('lodash');

var subscriptions = [];

function toJSON(){
    return Object.assign({}, this, { ws: undefined });
}

exports.createSubscription = function(subscriber, subscribeTo, ws){
    const subscription = {
        id: uuid(),
        subscriber: subscriber,
        subscribeTo: subscribeTo,
        ws: ws,
        toJSON: toJSON
    };

    subscriptions.push(subscription);

    console.log(`Subscription (id=${subscription.id}, subscriber=${subscriber}) created`);

    return subscription;
}

exports.getSubscriptionBySubscriberId = function(subscriberId){
    return _.filter(subscriptions, s => s.subscriber === subscriberId);
}

exports.getSubscriptionBySubscribeToId = function(subscribeTo){
    return _.filter(subscriptions, s => s.subscribeTo === subscribeTo);
}

exports.removeSubscriptionById = function(subscriptionId){
    _.remove(subscriptions, s => s.id === subscriptionId);

    console.log(`Subscriptions (id=${subscriptionId} removed)`);
}

exports.removeSubscriptionBySubscriberId = function(subscriberId){
    _.remove(subscriptions, s => s.subscriber === subscriberId);

    console.log(`Subscriptions (subscriberId=${subscriberId} removed)`);
}

exports.removeAll = function(){
    subscriptions = [];
}
