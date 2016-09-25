const uuid = require('node-uuid').v4;
const _ = require('lodash');

const subscriptions = [];

exports.createSubscription = function(subscriber, subscribeTo){
    const subscription = {
        id: uuid(),
        subscriber: subscriber,
        subscribeTo: subscribeTo
    };

    subscriptions.push(subscription);

    return subscription;
}

exports.removeSubscriptionById = function(subscriptionId){
    _.remove(subscriptions, s => s.id === subscriptionId);
}

exports.removeSubscriptionBySubscriberId = function(subscriberId){
    _.remove(subscriptions, s => s.subscriber === subscriberId);
}
