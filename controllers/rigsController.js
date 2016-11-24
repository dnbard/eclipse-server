const Rigs = require('../db/rigs');
const Ships = require('../db/ships');
const Stages = require('../core/stages');

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

function unequip(req, res, next){
    const ownerId = req._user._id;
    const containerId = req.params.id;
    const rigId = req.params.rigId;

    var _rig = null;

    Rigs.findOne({ _id: rigId }).exec().then((rig) => {
        if (!rig || rig.ownedBy !== ownerId || rig.storedIn !== containerId){
            return res.status(404).send(`Rig(id=${rigId}) not found`);
        }

        if (!rig.equipped){
            return res.status(400).send(`Rig(id=${rigId}) already unequipped`);
        }

        rig.equipped = false;

        return rig.save();
    }).then(rig => {
        _rig = rig;
        return Ships.findOne({ _id: containerId }).exec();
    }).then(ship => {
        const index = ship.rigs.indexOf(_rig.mods.id);
        const stageId = req._user.stageId;
        const stage = Stages.getOneById(stageId);
        const actor = stage.getActorByParentId(ownerId);

        if (index !== -1){
            ship.rigs.splice(index, 1);
        }

        actor.ship.unequip(_rig.mods.id);

        return ship.save();
    }).then(() => {
        res.send(_rig);
    }).catch((err) => {
        res.status(500).send(err);
    });
}

function equip(req, res, next){
    const ownerId = req._user._id;
    const containerId = req.params.id;
    const rigId = req.params.rigId;

    var _rig = null;

    Rigs.findOne({ _id: rigId }).exec().then((rig) => {
        if (!rig || rig.ownedBy !== ownerId || rig.storedIn !== containerId){
            return res.status(404).send(`Rig(id=${rigId}) not found`);
        }

        if (rig.equipped){
            return res.status(400).send(`Rig(id=${rigId}) already equipped`);
        }

        rig.equipped = true;

        return rig.save();
    }).then(rig => {
        _rig = rig;
        return Ships.findOne({ _id: containerId }).exec();
    }).then(ship => {
        // const index = ship.rigs.indexOf(_rig.mods.id);
        const stageId = req._user.stageId;
        const stage = Stages.getOneById(stageId);
        const actor = stage.getActorByParentId(ownerId);

        //TODO: check for turrets count
        // if (index !== -1){
            ship.rigs.push(_rig.mods.id);
        // }

        actor.ship.equip(_rig.mods.id);

        return ship.save();
    }).then(() => {
        res.send(_rig);
    }).catch((err) => {
        res.status(500).send(err);
    });
}

exports.getFew = getFew;
exports.unequip = unequip;
exports.equip = equip;
