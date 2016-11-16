define([
    'pubsub',
    'enums/events',
    'ko',
    'ui/app',

    'ui/components/menu',
    'ui/components/index'
], (PubSub, EVENTS, ko, AppViewmodel) => {
    var app = null;

    function UIApp(element){
        this.el = element;
        this.el.style.display = 'none';
        this.visible = false;

        ko.applyBindings(new AppViewmodel(), this.el);
    }

    UIApp.prototype.toggle = function(){
        if (this.visible){
            this.el.style.display = 'none';
            this.visible = false;
        } else {
            this.el.style.display = 'block';
            this.visible = true;
        }
    }

    return {
        init : function(selector){
            app = new UIApp(document.querySelector(selector));

            PubSub.subscribe(EVENTS.UI.TOGGLE, app.toggle.bind(app));

            return app;
        }, getApp: function(){
            return app;
        }
    }
});
