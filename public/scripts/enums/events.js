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
        }
    };

    converter(events);
})(function(data){
    typeof define === 'function' ? define(() =>  data) : module.exports = data;
});
