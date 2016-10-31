const stages = require('../core/stages');


exports.getOneById = function(req, res, next){
    const stage = stages.getOneById(req.params.id);

    if (stage){
        return res.send({
            _id: stage.id,
            name: stage.name,
            generic: stage.generic
        });
    }

    return res.status(404).send(`Stage(id=${req.params.id}) not found`);
}
