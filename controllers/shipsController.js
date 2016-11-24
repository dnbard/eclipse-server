const Ships = require('../db/ships');
const Rigs = require('../db/rigs');

const DEFAULT_SHIP = 'drifter';
const DEFAULT_SHIP_BLUEPRINT = require('../data/ships/drifter');

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
        var promises = [];

        if (DEFAULT_SHIP_BLUEPRINT.rigs.length > 0){
            promises = DEFAULT_SHIP_BLUEPRINT.rigs.map(rigName => {
                const r = require(`../data/rigs/${rigName}.json`);
                const rig = new Rigs({
                    equipped: true,
                    ownedBy: user._id,
                    storedIn: ship._id,
                    kind: r.kind,
                    mods: r,
                    name: r.name,
                });

                ship.rigs.push(r.id);

                return rig.save();
            });
        }

        promises.push(ship.save());

        findOrCreatePromise = Promise.all(promises).then(() => {
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
            base: ship.rigs ? Object.assign({}, shipBase, { rigs: ship.rigs }) : shipBase,
            mods: ship.mods || {}
        };
    });
}

exports.getOrCreate = getOrCreate;
exports.getOneById = getOneById;
