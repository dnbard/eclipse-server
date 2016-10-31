const packageJson = require('../package.json');
const config = require('../config');


exports.get = function(req, res){
    return res.send({
        status: 'OK',
        version: packageJson.version,
        isDebug: config.debug
    });
}
