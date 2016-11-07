const packageJson = require('../package.json');
const config = require('../config');
const request = require('request');

exports.get = function(req, res){
    return res.send({
        status: 'OK',
        version: packageJson.version,
        isDebug: config.debug
    });
}

exports.getBadge = function(req, res){
    request.get(`https://img.shields.io/badge/eclipse-v${packageJson.version}-brightgreen.svg`)
        .pipe(res);
}
