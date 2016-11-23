const Rigs = require('../../db/rigs');

module.exports = function(options, cb){
    Rigs.update({}, {
        quantity: 1
    }, {multi: true}, cb);
}
