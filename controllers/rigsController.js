const Rigs = require('../db/rigs');

function getFew(req, res, next){
    const ownerId = req._user._id;
    const containerId = req.params.id;

    if (!ownerId || !containerId){
        return res.status(400).send('Invalid arguments');
    }

    Rigs.find({ ownedBy: ownerId, storedIn: containerId}).exec().then(rigs => {
        res.send(rigs);
    }).catch(err => {
        res.status(500).send(err);
    });
}

exports.getFew = getFew;
