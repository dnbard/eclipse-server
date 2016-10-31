const Actor = require('../models/actor');
const Asteroid = require('../models/asteroid');
const config = require('../config');

const GEOMETRY = require('../enums/geometry');


module.exports = [{
    id: config.defaultStageId,
    name: 'Hale',
    onCreate: function(stage){
        stage.addActor(new Actor({
            x: 0,
            y: 0,
            kind: 'planet',
            geometry: GEOMETRY.CIRCLE,
            size: 118
        }));

        for(var i = 0; i < 32; i ++){
            var seed = Math.random() * Math.PI * 2 - Math.PI;
            var radius = Math.random() * 800 + 450;

            var asteroid = new Asteroid({
                x: Math.sin(seed) * radius,
                y: Math.cos(seed) * radius,
            });

            stage.addActor(asteroid);
        }
    }
}];
