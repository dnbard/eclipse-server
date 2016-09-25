const uuid = require('node-uuid').v4;

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
