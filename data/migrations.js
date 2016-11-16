'use strict';

const Users = require('../db/users');
const configs = require('../configs');
const Rigs = require('../db/rigs');

const DEFAULT_STAGE_ID = configs.get('stage.default');

module.exports = [function(options, cb){
    //Set default stageId for all users
    Users.update({}, {
        stageId: DEFAULT_STAGE_ID
    }, {multi: true}, cb);
}, function(options, cb){
    //Set default credits value for all users
    Users.update({}, {
        credits: 1000
    }, {multi: true}, cb);
}, function(options, cb){
    //Set default pvp value for all users
    Users.update({}, {
        pvp: 0
    }, {multi: true}, cb);
}, function(options, cb){
    Rigs.update({}, {
        equipped: true,
        equiped: undefined
    }, {multi: true}, cb);
}];
