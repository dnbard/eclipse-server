(function(converter){
    const ships = [{
        id: 'player-base',
        texture: '/public/images/spaceship-01.png',
        systems: [{
            kind: 'turret',
            offset: {x: 0, y: 0},
        }, {
            kind: 'trail',
            particle: 'trail',
            offset: {x: -12, y: 18}
        }, {
            kind: 'trail',
            particle: 'trail',
            offset: {x: 12, y: 18}
        }]
    },{
        id: 'npc-base',
        texture: '/public/images/spaceship-02.png',
        systems: [{
            kind: 'trail',
            particle: 'trail',
            offset: {x: 0, y: 12}
        }]
    }];

    converter(ships);
})(function(data){
    typeof define === 'function' ? define(() =>  data) : module.exports = data;
});
