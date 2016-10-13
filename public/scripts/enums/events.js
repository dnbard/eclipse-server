(function(converter){
    const events = {
        SUBSCRIBE: {
            CREATED: 'eclipse.subscribe.created'
        },
        CONNECTION: {
            OPEN: 'eclipse.connection.open'
        },
        STAGE: {
            UPDATED: 'eclipse.stage.updated',
            REMOVE_CHILD: 'eclipse.stage.remove-child'
        },
        COMMANDS: {
            ALL: 'eclipse.commands',
            PLAYER: {
                MOVETO: 'eclipse.commands.player.moveto',
                DECELERATE: 'eclipse.commands.player.decelerate',
                ACCELERATE: 'eclipse.commands.player.accelerate',
                RADIAL_ACCELERATE: 'eclipse.commands.player.radial_accelerate',
                RADIAL_DECELERATE: 'eclipse.commands.player.radial_decelerate',
                FIRE: 'eclipse.commands.player.fire'
            }
        }
    };

    function createHash(hash, events){
        for(var el in events){
            if (typeof events[el] === 'string'){
                hash[events[el]] = events[el].length;
            } else if (typeof events[el] === 'object'){
                createHash(hash, events[el]);
            }
        }

        return hash;
    }

    events._hash = createHash({}, events);

    converter(events);
})(function(data){
    typeof define === 'function' ? define(() =>  data) : module.exports = data;
});
