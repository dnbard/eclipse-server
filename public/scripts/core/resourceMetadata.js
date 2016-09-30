define([
    'lodash',
    'text!images/metadata.json',
    'text!images/spaceships.json'
], function(_, metadata, spaceships){
    return _.concat(
        JSON.parse(metadata),
        JSON.parse(spaceships)
    );
});
