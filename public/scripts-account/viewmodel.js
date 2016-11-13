define([
    'ko',
    'core/token',
    'core/fetch',
    'core/tokenCheck'
], function(ko, token, fetch, tokenCheck){
    function Viewmodel(){
        this.login = ko.observable('');
        this.password = ko.observable('');

        this.isDisabled = ko.computed(() => {
            return this.login().length < 4 || this.password().length < 7;
        }, this);

        this.isTokenValid = ko.observable(false);

        this.error = ko.observable('');
        this.user = ko.observable(null);
        this.stage = ko.observable(null);
        this.ship = ko.observable(null);

        tokenCheck().then(user => {
            this.user(user);
            this.isTokenValid(true);

            return fetch(`/stages/${user.stageId}`);
        }).then(stage => {
            this.stage(stage);

            const shipId = this.user().shipId;

            if (!shipId){
                return { kind: '---' };
            }

            return fetch(`/spaceships/${shipId}`);
        }).then((ship) => {
            this.ship(ship);
        }).catch(() => {
            this.isTokenValid(false);
            this.user(null);
        });
    }

    Viewmodel.prototype.registerUser = function(){
        if (this.isDisabled()){
            return;
        }

        fetch('/users', {
            method: 'post',
            body: JSON.stringify({
                login: this.login(),
                password: this.password()
            })
        }).then(user => {
            token.set(user.token);
            location.reload();
        }).catch(err => {
            this.error(`Unable to create new user: ${err.statusText}`);
        });
    }

    Viewmodel.prototype.logout = function(){
        token.erase();
        location.reload();
    }

    Viewmodel.prototype.play = function(){
        location.href = '/eclipse';
    }

    Viewmodel.prototype.doLogin = function(){
        if (this.isDisabled()){
            return;
        }

        fetch('/login', {
            method: 'post',
            body: JSON.stringify({
                login: this.login(),
                password: this.password()
            })
        }).then(user => {
            token.set(user.token);
            location.reload()
        }).catch(err => {
            this.error(`Unable to login: ${err.statusText}`);
        });
    }

    return Viewmodel;
});
