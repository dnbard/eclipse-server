"use strict";

const _ = require('lodash');

const Users = require('../db/users');
const Transactions = require('../db/transactions');
const Subscriptions = require('../core/subscriptions');
const WebSockets = require('../core/ws');

const EVENTS = require('../public/scripts/enums/events');
const TRANSACTIONS = require('../enums/transactionTypes');

var transactions = {};

function createOne(userId, value, type){
    type = type || TRANSACTIONS.CREDITS;

    const transaction = {
        userId: userId,
        value: value,
        timestamp: new Date(),
        type: type
    };

    console.log(`Created transaction(userId=${userId}, type=${type}, value=${value})`);

    if (transactions[userId]){
        transactions[userId].push(transaction);
    } else {
        transactions[userId] = [ transaction ];
    }
}

function update(){
    _.map(transactions, transactionIterator);
}

function transactionIterator(userTransactions, userId){
    return Users.findOne({ _id: userId }).exec().then(user => {
        if (!user){
            throw new Error(`User(id=${userId}) not found.`);
        }

        const change = _.chain(userTransactions)
            .filter(creditsFilter)
            .map(mapValue)
            .reduce(reducer)
            .value() || 0;

        var pvpChange = _.chain(userTransactions)
            .filter(pvpFilter)
            .map(mapValue)
            .reduce(reducer)
            .value() || 0;

        console.log(`User(id=${userId}, name=${user.login}), credits changed by ${change}, pvp by ${pvpChange}`);

        user.credits += change;
        user.pvp += pvpChange;
        if (user.pvp < 0){
            user.pvp = 0;
        }

        const _tr = new Transactions({
            value: change,
            overall: user.credits,
            userId: userId,
            pvp: pvpChange
        });
        _tr.save();

        return user.save();
    }).then((user) => {
        delete transactions[userId];

        const subscription = Subscriptions.getSubscriptionBySubscriberId(userId)[0];
        if (!subscription){
            return;
        }

        WebSockets.sendMessage(subscription.ws, {
            subject: EVENTS.IDENTITY.CHANGED,
            message: {
                _id: user._id,
                credits: user.credits,
                pvp: user.pvp
            }
        });
    });
}

function creditsFilter(a){
    return a.type === TRANSACTIONS.CREDITS;
}

function pvpFilter(a){
    return a.type === TRANSACTIONS.PVP;
}

function mapValue(a){
    return a.value;
}

function reducer(a, b){
    return a + b;
}

exports.createOne = createOne;
exports.update = update;
