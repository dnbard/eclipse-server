'use strict';

const logger = require('../core/logger').child({widget_type: 'httpRequest'});

module.exports = function(req, res, next) {
    logger.info(`${req.method} ${req.url}`);
    next();
}
