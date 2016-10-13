define([
    'pubsub',
    'vendor/alertify',
    'enums/events'
], (PubSub, alertify, EVENTS) => {
    var token = null;

    PubSub.subscribe(EVENTS.CONNECTION.OPEN, (e, payload) => {
        token = payload.message.token
    });

    function getProtocol(){
        return location.protocol === 'https:' ? 'wss' : 'ws';
    }

    function genericConnect(){
        const ws = new WebSocket(`${getProtocol()}://${location.host}`);

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
                message: data,
                token: token
            }));
        });

        return ws;
    }

    return {
        genericConnect: genericConnect
    };
});
