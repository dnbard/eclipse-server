const Users = require('../db/users');
const config = require('../config');


module.exports = [function(options, cb){
    //Set default stageId for all users
    Users.update({}, {
        stageId: config.defaultStageId
    }, cb);
}, function(options, cb){
    //Set default credits value for all users
    Users.update({}, {
        credits: 1000
    }, cb);
}];
