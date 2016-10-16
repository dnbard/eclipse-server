define([
    'pubsub',
    'pako',
    'vendor/alertify',
    'enums/events'
], (PubSub, pako, alertify, EVENTS) => {
    var token = null
        bytesSent = 0;

    PubSub.subscribe(EVENTS.CONNECTION.OPEN, (e, payload) => {
        token = payload.message.token
    });

    function getProtocol(){
        return location.protocol === 'https:' ? 'wss' : 'ws';
    }

    function genericConnect(){
        const _name = location.hash.replace('#', '');


        const ws = new WebSocket(`${getProtocol()}://${location.host}?name=${_name}`);

        ws.onopen = () => {
            alertify.log('Connection established');
        }

        ws.onclose = () => {
            alertify.delay(0).closeLogOnClick(true).error('Connection lost');
        }

        ws.onmessage = (payload, flags) => {
            const message = JSON.parse(pako.inflate(payload.data, { to: 'string' }));
            PubSub.publish(message.subject, Object.assign(message, {
                _length: payload.data.length
            }));
        }

        PubSub.subscribe(EVENTS.COMMANDS.ALL, (e, data) => {
            const payload = JSON.stringify({
                subject: e,
                message: data,
                token: token
            });
            const payloadSize = payload.length;
            bytesSent += payloadSize;

            ws.send(payload);
        });

        return ws;
    }

    const sentOut = document.getElementById('sent');
    setInterval(() => {
        sentOut.textContent = bytesSent < 100000 ?
            `| ⬆${(bytesSent / 1000).toFixed(0)}KB` :
            `| ⬆${(bytesSent / 1000000).toFixed(1)}MB`;
    }, 1000);

    return {
        genericConnect: genericConnect
    };
});
