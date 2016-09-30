(function(converter){
    const events = {
        SUBSCRIBE: {
            CREATED: 'eclipse.subscribe.created'
        },
        CONNECTION: {
            OPEN: 'eclipse.connection.open'
        },
        STAGE: {
            UPDATED: 'eclipse.stage.updated'
        },
        COMMANDS: {
            ALL: 'eclipse.commands',
            PLAYER: {
                MOVETO: 'eclipse.commands.player.moveto'
            }
        }
    };

    converter(events);
})(function(data){
    typeof define === 'function' ? define(() =>  data) : module.exports = data;
});
