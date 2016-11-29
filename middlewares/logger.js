'use strict';

const onFinished = require('on-finished');
const logger = require('../core/logger')
    .child({widget_type: 'httpRequest'});

function onFinishedHandler(err, req){
    const size = req.res._headers['content-length'];
    //ES6 templates aren't used because of performance degradation in comparison to plain strings concatenation
    let output = req.method + ' ' + req.url + ' - ' + req.res.statusCode + ' ' + (new Date() - req._timestamp) + 'ms';

    if (size){
        output += req.res._headers['content-length']+ 'b';
    }

    return logger.info(output);
}

module.exports = function(req, res, next) {
    req._timestamp = new Date();
    onFinished(req, onFinishedHandler);
    next();
}
