const Users = require('../../db/users');

module.exports = function(options, cb){
    //Set default pvp value for all users
    Users.update({}, {
        pvp: 0
    }, {multi: true}, cb);
}
