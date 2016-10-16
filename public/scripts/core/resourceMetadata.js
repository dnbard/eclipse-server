define([
    'lodash',
    'text!images/metadata.json',
    'text!images/spaceships.json',
    'text!images/turrets.json',
    'text!images/effects.json',
    'text!images/backgrounds.json',
    'text!images/asteroids/asteroids.json'
], function(_, metadata, spaceships, turrets, effects, backgrounds, asteroids){
    return _.concat(
        JSON.parse(metadata),
        JSON.parse(spaceships),
        JSON.parse(turrets),
        JSON.parse(effects),
        JSON.parse(backgrounds),
        JSON.parse(asteroids)
    );
});
