define([
    'pubsub'
], (PubSub) => {
    function genericConnect(){
        const ws = new WebSocket(`ws://${location.host}`);

        ws.onopen = function () {

        }

        ws.onmessage = function (data, flags) {
            const payload = JSON.parse(data.data);
            console.log(`=> "${payload.subject}" :: ${JSON.stringify(payload.message, null, 2)}`);

            PubSub.publish(payload.subject, payload);
        }

        return ws;
    }

    return {
        genericConnect: genericConnect
    };
});
