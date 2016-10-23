const Users = require('../db/users');
const Tokens = require('../db/tokens');

exports.postUser = function(req, res, next){
    Users.createOne(req.body).then((user) => {
        res.send(user);
    }).catch(err => {
        res.status(400).send(err);
    });
}

exports.getUserByToken = function(req, res, next){
    const token = (req.headers['authorization'] || '').replace('Bearer ', '');
    const dateNow = Date.now();

    Tokens.findOne({ token: token }).exec().then(token => {
        if (!token){
            return res.status(401).send('Token not found');
        }

        if (new Date(token.expiresAt) < dateNow){
            return res.status(401).send(`Token ${token_id} has been expired`);
        }

        req._token = token;

        return Users.findOne({ _id: token.userId }).exec();
    }).then(user => {
        if (!user){
            return res.status(401).send('Token not found');
        }

        req._user = user;
        next();
    });
}

exports.getUser = function(req, res){
    const user = req._user;
    const token = req._token;

    if (!user){
        return res.status(500).send('No User entity available');
    }

    if(!token){
        return res.status(500).send('No Token entity available');
    }

    res.send({
        _id: user._id,
        login: user.login,
        token: token.token,
        tokenId: token._id,
        expiresAt: token.expiresAt
    });
}
