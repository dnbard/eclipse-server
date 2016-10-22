const Users = require('../db/users');

exports.postUser = function(req, res, next){
    Users.createOne(req.body).then((user) => {
        res.send(user);
    }).catch(err => {
        res.status(400).send(err);
    });
}
