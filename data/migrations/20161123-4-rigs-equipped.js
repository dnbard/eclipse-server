const Rigs = require('../../db/rigs');

module.exports = function(options, cb){
    Rigs.update({}, {
        equipped: true,
        equiped: undefined
    }, {multi: true}, cb);
}
