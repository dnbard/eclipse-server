define([
    'ko',
    'pubsub',
    'text!templates/uiIndex.html',
    'enums/events',
    'enums/menuItems',

    'ui/components/cargo',
    'ui/components/pvp'
], (ko, PubSub, template, EVENTS, MENU_ITEMS) => {
    ko.components.register('ui-index', {
        viewModel: function(){
            this.MENU_ITEMS = MENU_ITEMS;

            this.activePage = ko.observable(null);

            PubSub.subscribe(EVENTS.UI.TOGGLE, () => this.activePage(MENU_ITEMS.CARGO));
            PubSub.subscribe(EVENTS.UI.MENU_ITEM.SELECTED, (e, data) => this.activePage(data.item));
        },
        template: template
    });
});
