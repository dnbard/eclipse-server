const configs = require('../../configs');
const Users = require('../../db/users');

const DEFAULT_STAGE_ID = configs.get('stage.default');

//Set default stageId for all users
module.exports = function(options, cb){
    Users.update({}, {
        stageId: DEFAULT_STAGE_ID
    }, {multi: true}, cb);
}
