'use strict';

const Users = require('../db/users');
const configs = require('../configs');

const DEFAULT_STAGE_ID = configs.get('stage.default');

module.exports = [function(options, cb){
    //Set default stageId for all users
    Users.update({}, {
        stageId: DEFAULT_STAGE_ID
    }, cb);
}, function(options, cb){
    //Set default credits value for all users
    Users.update({}, {
        credits: 1000
    }, cb);
}, function(options, cb){
    //Set default pvp value for all users
    Users.update({}, {
        pvp: 0
    }, cb);
}];
