define([
    'lodash',
    'pubsub',
    'enums/events'
], function(_, PubSub, EVENTS){
    const commands = {};

    PubSub.subscribe(EVENTS.SUBSCRIBE.CREATED, (e, payload) => {
        if (payload.message.isDebug){
            window.DEBUG = {
                execute: execute
            };

            _.each(commands, (c, cName) => {
                window.DEBUG[cName] = c;
            });
        }
    });

    function execute(commandId, args){
        commands[commandId].call(null, args);
    }

    return {
        registerCommand: function(id, handler){
            commands[id] = handler;
        },
        execute: execute
    }
});
