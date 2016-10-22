const express = require('express');
const bodyParser = require('body-parser')

const pages = require('./pages');


exports.init = function(app){
    app.use(pages);

    app.use('/public', express.static('public'));

    app.use(bodyParser.json());
}
