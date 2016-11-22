define([
    'ko',
    'pubsub',
    'core/fetch',
    'text!templates/uiPVP.html',
    'enums/events'
], (ko, PubSub, fetch, template, EVENTS) => {
    ko.components.register('ui-pvp', {
        viewModel: function(){
            this.rating = ko.observableArray([]);

            this.fetchData = function(){
                return fetch(`/users/pvp`)
                    .then(rating => this.rating(rating));
            }

            PubSub.subscribe(EVENTS.UI.TOGGLE, this.fetchData.bind(this));
            this.fetchData();
        },
        template: template
    });
});
