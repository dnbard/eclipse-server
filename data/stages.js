const Actor = require('../models/actor');
const Asteroid = require('../models/asteroid');

const GEOMETRY = require('../enums/geometry');


module.exports = [{
    id: 'ce44bd18-b408-492f-b561-0d8f1a8c5421',
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
            const seed = Math.random() * Math.PI * 2 - Math.PI;
            const radius = Math.random() * 800 + 450;

            const asteroid = new Asteroid({
                x: Math.sin(seed) * radius,
                y: Math.cos(seed) * radius,
            });

            stage.addActor(asteroid);
        }
    }
}];
