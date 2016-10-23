define([
    'core/token',
    'core/fetch'
], function(token, fetch){
    return function(){
        const currentToken = token.get();

        if (!currentToken){
            return Promise.reject();
        }

        return fetch('/users');
    }
});
