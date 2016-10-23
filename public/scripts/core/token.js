define(function(){
    const LOCALSTORAGE_TOKEN_KEY = '__eclipse-token';

    return {
        get: function(){
            return localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
        },
        set: function(newToken){
            localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, newToken);
        },
        erase: function(){
            localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
        }
    };
});
