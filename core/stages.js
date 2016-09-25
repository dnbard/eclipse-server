const uuid = require('node-uuid').v4;
const collection = [];

exports.createStage = function(options){
    const stage = {
        generic: true,
        actors: [{
            kind: 'planet',
            x: 96,
            y: 96
        }],
        id: uuid()
    }

    collection.push(stage);

    return stage;
}

exports.getOrCreateGeneric = function(){
    var stage = collection.filter(s => s.generic)[0];

    return stage || exports.createStage();
}
