(function(converter){
    const ships = [{
        id: 'drifter',
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
        id: 'morder',
        texture: '/public/images/spaceship-02.png',
        systems: [{
            kind: 'trail',
            particle: 'trail',
            offset: {x: 0, y: 12}
        }]
    },{
        id: 'hammerhead',
        texture: '/public/images/hammerhead.png',
        systems: [{
            kind: 'trail',
            particle: 'trail',
            offset: {x: -8, y: 16}
        }, {
            kind: 'trail',
            particle: 'trail',
            offset: {x: 8, y: 16}
        }]
    }];

    converter(ships);
})(function(data){
    typeof define === 'function' ? define(() =>  data) : module.exports = data;
});
