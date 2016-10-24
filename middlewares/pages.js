const config = require('../config');

const pagesCollection = {
    '/': 'index.html',
    '/eclipse': 'eclipse.html'
};

module.exports = function(req, res, next){
    const page = pagesCollection[req.url];

    if (page && req.method === 'GET'){
        res.sendFile(`${config.appRoot}/public/${page}`);
    } else {
        next();
    }
}
