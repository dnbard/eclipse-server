const express = require('express');
const pages = require('./pages');

exports.init = function(app){
    app.use(pages);

    app.use('/public', express.static('public'));
}
