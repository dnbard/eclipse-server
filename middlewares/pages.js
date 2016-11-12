'use strict';

const appRoot = require('app-root-path');

const pagesCollection = {
    '/': 'index.html',
    '/eclipse': 'eclipse.html'
};

module.exports = function(req, res, next){
    const page = pagesCollection[req.url];

    if (page && req.method === 'GET'){
        res.sendFile(`${appRoot}/public/${page}`);
    } else {
        next();
    }
}
