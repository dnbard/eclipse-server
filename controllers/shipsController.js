const Ships = require('../db/ships');

const DEFAULT_SHIP = 'drifter';

function getOneById(req, res, next){
    const shipId = req.params.id;

    Ships.findOne({ _id: shipId }).exec().then(ship => {
        if (ship){
            res.send(ship);
        } else {
            res.status(404).send(`Spaceship(id=${shipId} not found)`);
        }
    });
}

function getOrCreate(user){
    const shipId = user.shipId;

    var findOrCreatePromise = null;

    if (shipId){
        findOrCreatePromise = Ships.findOne({ _id: shipId }).exec();
    } else {
        const ship = new Ships({
            kind: DEFAULT_SHIP,
            ownedBy: user._id
        });

        findOrCreatePromise = ship.save().then(() => {
            user.shipId = ship._id;
            return user.save();
        }).then(() => {
            return Ships.findOne({ _id: ship._id }).exec();
        });
    }

    return findOrCreatePromise.then((ship) => {
        const shipKind = ship.kind;
        const shipBase = require(`../data/ships/${shipKind}.json`);

        return {
            id: ship._id,
            kind: shipKind,
            base: shipBase,
            mods: ship.mods || {}
        };
    });
}

exports.getOrCreate = getOrCreate;
exports.getOneById = getOneById;
