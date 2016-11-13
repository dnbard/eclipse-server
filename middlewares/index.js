const express = require('express');
const bodyParser = require('body-parser')

const pages = require('./pages');
const logger = require('./logger');

exports.init = function(app){
    app.use(logger);
    app.use(pages);

    app.use('/public', express.static('public'));

    app.use(bodyParser.json());
}
