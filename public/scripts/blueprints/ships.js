(function(converter){
    const ships = [{
        id: 'player-base',
        texture: '/public/images/spaceship-01.png',
        systems: [{
            kind: 'turret',
            offset: {x: 0, y: 0},
        }/*, {
            kind: 'trail',
            offset: {x: -10, y: 20}
        }*/, {
            kind: 'trail',
            offset: {x: 0, y: 22}
        }]
    }];

    converter(ships);
})(function(data){
    typeof define === 'function' ? define(() =>  data) : module.exports = data;
});
