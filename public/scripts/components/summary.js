define([
    'pubsub',
    'core/fetch',
    'enums/events'
], (PubSub, fetch, EVENTS) => {
    const element = document.querySelector('#summary');

    PubSub.subscribe(EVENTS.CONNECTION.OPEN, (e, payload) => {
        element.innerHTML = `<div class="system-name"></div>
            <div class="credits"></div>
        <div class="pvp"></div>`;

        fetch('/users').then(user => {
            element.querySelector('.credits').textContent = `${user.credits.toFixed(0)} credits`;
            element.querySelector('.pvp').textContent = `Rating: ${user.pvp.toFixed(0)}`;
        });
    });

    PubSub.subscribe(EVENTS.IDENTITY.CHANGED, (e, payload) => {
        element.querySelector('.credits').textContent = `${payload.message.credits.toFixed(0)} credits`;
        element.querySelector('.pvp').textContent = `Rating: ${payload.message.pvp.toFixed(0)}`;
    });
});
