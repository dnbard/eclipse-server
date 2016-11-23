const Users = require('../../db/users');

module.exports = function(options, cb){
    //Set default credits value for all users
    Users.update({}, {
        credits: 1000
    }, {multi: true}, cb);
}
