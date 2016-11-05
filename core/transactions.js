"use strict";

const _ = require('lodash');

const Users = require('../db/users');
const Transactions = require('../db/transactions');
const Subscriptions = require('../core/subscriptions');
const WebSockets = require('../core/ws');

const EVENTS = require('../public/scripts/enums/events');

var transactions = {};

function createOne(userId, value){
    const transaction = {
        userId: userId,
        value: value,
        timestamp: new Date()
    };

    console.log(`Created transaction(userId=${userId}, value=${value})`);

    if (transactions[userId]){
        transactions[userId].push(transaction);
    } else {
        transactions[userId] = [ transaction ];
    }
}

function update(){
    console.log(`Transactions update started`);
    Promise.all(_.map(transactions, transactionIterator)).then(() => {
        console.log('Transactions update ended');
    });
}

function transactionIterator(userTransactions, userId){
    return Users.findOne({ _id: userId }).exec().then(user => {
        if (!user){
            throw new Error(`User(id=${userId}) not found.`);
        }

        const change = _.reduce(userTransactions, creditsReducer).value;
        console.log(`User(id=${userId}), credits changed by ${change}`);

        user.credits += change;

        const _tr = new Transactions({
            value: change,
            overall: user.credits,
            userId: userId
        });
        _tr.save();

        return user.save();
    }).then((user) => {
        delete transactions[userId];

        const subscription = Subscriptions.getSubscriptionBySubscriberId(userId)[0];
        if (!subscription){
            return;
        }

        console.log({
            subject: EVENTS.IDENTITY.CHANGED,
            message: {
                _id: user._id,
                credits: user.credits
            }
        });

        WebSockets.sendMessage(subscription.ws, {
            subject: EVENTS.IDENTITY.CHANGED,
            message: {
                _id: user._id,
                credits: user.credits
            }
        });
    });
}

function creditsReducer(a, b){
    a.value += b.value;
    return a;
}

exports.createOne = createOne;
exports.update = update;
