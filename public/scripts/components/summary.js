define([
    'pubsub',
    'core/fetch',
    'enums/events'
], (PubSub, fetch, EVENTS) => {
    const element = document.querySelector('#summary');

    function formatNumber(x) {
        return x.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    PubSub.subscribe(EVENTS.CONNECTION.OPEN, (e, payload) => {
        element.innerHTML =
            `<div class="system-name"></div>
            <div>
                <img src="/public/images/ui/credits.svg" width="24" />
                <span class="credits"></span>
            </div>
            <div>
                <img src="/public/images/ui/pvp.svg" width="24" />
                <span class="pvp"></span>
            </div>`;

        element.querySelector('.system-name').textContent = `${payload.message.stage.name} system`;

        fetch('/users').then(user => {
            element.querySelector('.credits').textContent = formatNumber(user.credits);
            element.querySelector('.pvp').textContent = formatNumber(user.pvp);
        });
    });

    PubSub.subscribe(EVENTS.IDENTITY.CHANGED, (e, payload) => {
        element.querySelector('.credits').textContent = formatNumber(payload.message.credits);
        element.querySelector('.pvp').textContent = formatNumber(payload.message.pvp);
    });
});
