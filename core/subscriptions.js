const uuid = require('node-uuid').v4;
const _ = require('lodash');

var subscriptions = [];

exports.createSubscription = function(subscriber, subscribeTo){
    const subscription = {
        id: uuid(),
        subscriber: subscriber,
        subscribeTo: subscribeTo
    };

    subscriptions.push(subscription);

    return subscription;
}

exports.getSubscriptionBySubscriberId = function(subscriberId){
    return _.filter(subscriptions, s => s.subscriber === subscriberId);
}

exports.removeSubscriptionById = function(subscriptionId){
    _.remove(subscriptions, s => s.id === subscriptionId);
}

exports.removeSubscriptionBySubscriberId = function(subscriberId){
    _.remove(subscriptions, s => s.subscriber === subscriberId);
}

exports.removeAll = function(){
    subscriptions = [];
}
