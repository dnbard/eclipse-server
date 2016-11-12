'use strict';

const packageJson = require('../package.json');
const configs = require('../configs');
const request = require('request');

const DEBUG_UI = configs.get('debug.ui');

exports.get = function(req, res){
    return res.send({
        status: 'OK',
        version: packageJson.version,
        isDebug: DEBUG_UI
    });
}

exports.getBadge = function(req, res){
    request.get(`https://img.shields.io/badge/eclipse-v${packageJson.version}-brightgreen.svg`)
        .pipe(res);
}
