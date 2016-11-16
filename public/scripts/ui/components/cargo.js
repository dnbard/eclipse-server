define([
    'ko',
    'pubsub',
    'core/fetch',
    'text!templates/uiCargo.html',
    'enums/events',
    'enums/menuItems'
], (ko, PubSub, fetch, template, EVENTS, MENU_ITEMS) => {
    var stage = null;

    PubSub.subscribe(EVENTS.CONNECTION.OPEN, (e, payload) => {
        stage = payload.message.stage;
    });


    ko.components.register('ui-cargo', {
        viewModel: function(){
            this.rigs = ko.observableArray([]);


            this.fetchData = function(){
                fetch(`/storage/${stage._id}/rigs`).then((rigs) => {
                    debugger;
                });
            }.bind(this);

            this.fetchData();
        },
        template: template
    });
});
