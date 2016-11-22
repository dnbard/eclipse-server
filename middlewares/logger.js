'use strict';

const onFinished = require('on-finished');
const logger = require('../core/logger')
    .child({widget_type: 'httpRequest'});

function onFinishedHandler(err, req){
    const size = req.res._headers['content-length'];
    const output = [
        req.method,
        req.url,
        '-',
        req.res.statusCode,
        `${new Date() - req._timestamp}ms`
    ];

    if (size){
        output.push(`${req.res._headers['content-length']}b`);
    }

    logger.info(output.join(' '));
}

module.exports = function(req, res, next) {
    req._timestamp = new Date();
    onFinished(req, onFinishedHandler);
    next();
}
