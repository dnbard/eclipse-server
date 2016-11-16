define([
    'ko',
    'pubsub',
    'core/fetch',
    'text!templates/uiCargo.html',
    'enums/events',
    'enums/menuItems'
], (ko, PubSub, fetch, template, EVENTS, MENU_ITEMS) => {
    var stage = null,
        spaceship = null;

    PubSub.subscribe(EVENTS.CONNECTION.OPEN, (e, payload) => {
        stage = payload.message.stage;
        spaceship = payload.message.spaceship;
    });


    ko.components.register('ui-cargo', {
        viewModel: function(){
            this.rigs = ko.observableArray([]);


            this.fetchData = function(){
                fetch(`/storage/${spaceship.id}/rigs`)
                    .then(rigs => this.rigs(rigs));
            }

            this.getIcon = function(){
                return '/public/images/ui/turret.svg';
            }

            this.getEquippedIcon = function(rig){
                return rig.equipped ? '/public/images/ui/unplug.svg' :
                    '/public/images/ui/plug.svg';
            }

            this.getEquippedTitle = function(rig){
                return rig.equipped ? 'Unplug from Spaceship' : 'Plug into the Spaceship';
            }

            this.fetchData();
        },
        template: template
    });
});
