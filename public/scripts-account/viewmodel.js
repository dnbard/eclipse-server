define([
    'ko'
], function(ko){
    function Viewmodel(){
        this.login = ko.observable('');
        this.password = ko.observable('');

        this.isDisabled = ko.computed(() => {
            return this.login().length < 4 || this.password().length < 7;
        }, this);
    }

    return Viewmodel;
});
