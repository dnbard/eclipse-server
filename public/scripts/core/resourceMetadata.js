define([
    'lodash',
    'text!images/metadata.json',
    'text!images/spaceships.json',
    'text!images/turrets.json',
    'text!images/effects.json'
], function(_, metadata, spaceships, turrets, effects){
    return _.concat(
        JSON.parse(metadata),
        JSON.parse(spaceships),
        JSON.parse(turrets),
        JSON.parse(effects)
    );
});
