const Ships = require('../../db/ships');

module.exports = function(opt, cb){
    Ships.find({}).exec().then(ships => {
        Promise.all(ships.map(s => {
            console.log(s);

            if (s.rigs.length !== 0) {
                return Promise.resolve();
            }

            s.rigs = [ "turret-ion" ];
            return s.save();
        })).then(() => {
            cb(null);
        });
    });
}
