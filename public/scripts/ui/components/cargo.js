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
            var self = this;

            this.rigs = ko.observableArray([]);

            this.fetchData = function(){
                fetch(`/storage/${spaceship.id}/rigs`)
                    .then(rigs => this.rigs(rigs));
            }

            this.getIcon = function(rig){
                if (rig.kind === 'turret'){
                    return '/public/images/ui/turret.svg';
                } else if (rig.kind === 'chrondite'){
                    return '/public/images/ui/ore.svg';
                }
                return '/public/images/ui/defaultBuff.svg';
            }

            this.getEquippedIcon = function(rig){
                return rig.equipped ? '/public/images/ui/unplug.svg' :
                    '/public/images/ui/plug.svg';
            }

            this.getEquippedTitle = function(rig){
                return rig.equipped ? 'Unplug from Spaceship' : 'Plug into the Spaceship';
            }

            this.equipToggle = function(rig){
                function updateInventory(rigToUpdate){
                    self.rigs.remove(r => r._id === rigToUpdate._id);
                    self.rigs.push(rigToUpdate);
                }

                fetch(`/storage/${spaceship.id}/rigs/${rig._id}/${rig.equipped ? 'unequip' : 'equip'}`, { method: 'post' }).then(updateInventory);
            }

            PubSub.subscribe(EVENTS.UI.TOGGLE, this.fetchData.bind(this));
            this.fetchData();
        },
        template: template
    });
});
