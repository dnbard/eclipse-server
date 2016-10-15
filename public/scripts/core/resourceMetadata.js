define([
    'lodash',
    'text!images/metadata.json',
    'text!images/spaceships.json',
    'text!images/turrets.json',
    'text!images/effects.json',
    'text!images/backgrounds.json'
], function(_, metadata, spaceships, turrets, effects, backgrounds){
    return _.concat(
        JSON.parse(metadata),
        JSON.parse(spaceships),
        JSON.parse(turrets),
        JSON.parse(effects),
        JSON.parse(backgrounds)
    );
});
