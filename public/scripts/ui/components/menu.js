define([
    'ko',
    'pubsub',
    'text!templates/uiMenu.html',
    'enums/menuItems',
    'enums/events'
], (ko, PubSub, template, MENU_ITEMS, EVENTS) => {
    ko.components.register('ui-menu', {
        viewModel: function(){
            this.MENU_ITEMS = MENU_ITEMS;

            this.selectedMenuItem = ko.observable(null);
            this.selectedMenuItem.subscribe((value) => {
                PubSub.publish(EVENTS.UI.MENU_ITEM.SELECTED, {
                    item: value
                });
            });

            this.selectCargo = () => {
                this.selectedMenuItem(MENU_ITEMS.CARGO);
            }


            this.selectCargo();
        },
        template: template
    });
});
