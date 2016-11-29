define([
    'core/token'
],function(tokenProvider){
    function toJson(r){
        return r.json();
    }

    function checkStatus(r){
        if (r.status < 400){
            return r;
        }

        return r.json().then(r => {
            return Promise.reject(r);
        });
    }

    return function(url, options){
        const token = tokenProvider.get();

        return fetch(url, Object.assign({
            headers: {
                authorization: token ? `Bearer ${token}` : null,
                'content-type': 'application/json'
            }
        }, options || {}))
            .then(checkStatus)
            .then(toJson);
    }
});
