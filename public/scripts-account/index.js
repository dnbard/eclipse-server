requirejs.config({
    paths:{
        'templates': '../templates',
        'images': '../images',
        'particles': '../particles',
        'account': '/public/scripts-account',
        'pubsub': 'https://cdnjs.cloudflare.com/ajax/libs/pubsub-js/1.5.3/pubsub',
        'lodash': 'https://cdn.jsdelivr.net/lodash/4.16.2/lodash.min',
        'ko': 'https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min',
        'core': '../scripts/core'
    }
});


define([
    'ko',
    'account/viewmodel'
], (ko, Viewmodel) => {
    ko.applyBindings(new Viewmodel());
    document.querySelector('body').style.display = 'flex';
});
