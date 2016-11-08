const Users = require('../db/users');
const Transactions = require('../core/transactions');

const TRANSACTIONS = require('../enums/transactionTypes');

const ELO_K = 48;
const DEFAULT_STATE = 'kill';
const DEATH = true;

function calculateRating(ratingTo, ratingTarget, isDeath){
    return ratingTo > 1500 ?
        ELO_K / ( 1 + Math.pow(10, (ratingTo - ratingTarget) / 400) ) :
        isDeath ? ELO_K * 0.400 : ELO_K;
}

function doMath(userIdTo, userIdTarget){
    return Promise.all([
        Users.findOne({ _id: userIdTo }).exec(),
        Users.findOne({ _id: userIdTarget }).exec()
    ]).then((results) => {
        const userTo = results[0];
        const userTarget = results[1];

        const ratingTo = calculateRating(userTo.pvp, userTarget.pvp);
        const ratingTarget = -calculateRating(userTarget.pvp, userTo.pvp, DEATH);

        Transactions.createOneAndExecute(userIdTarget, ratingTo, TRANSACTIONS.PVP);
        Transactions.createOneAndExecute(
            userIdTo,
            userTo.pvp + ratingTarget > 0 ? ratingTarget: -userTo.pvp,
            TRANSACTIONS.PVP
        );
    });
}

exports.calculateRating = calculateRating;
exports.doMath = doMath;
exports.ELO_K = ELO_K;
