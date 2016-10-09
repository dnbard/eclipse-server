define([
    'lodash',
    'text!images/metadata.json',
    'text!images/spaceships.json',
    'text!images/turrets.json'
], function(_, metadata, spaceships, turrets){
    return _.concat(
        JSON.parse(metadata),
        JSON.parse(spaceships),
        JSON.parse(turrets)
    );
});
