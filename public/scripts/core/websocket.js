define([
    'pubsub',
    'vendor/alertify',
    'enums/events'
], (PubSub, alertify, EVENTS) => {
    function genericConnect(){
        const ws = new WebSocket(`ws://${location.host}`);

        ws.onopen = () => {
            alertify.log('Connection established');
        }

        ws.onclose = () => {
            alertify.delay(0).closeLogOnClick(true).error('Connection lost');
        }

        ws.onmessage = (data, flags) => {
            const payload = JSON.parse(data.data);
            PubSub.publish(payload.subject, payload);
        }

        PubSub.subscribe(EVENTS.COMMANDS.ALL, (e, data) => {
            ws.send(JSON.stringify({
                subject: e,
                message: data
            }));
        });

        return ws;
    }

    return {
        genericConnect: genericConnect
    };
});
