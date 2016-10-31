define([
    'pubsub',
    'pako',
    'vendor/alertify',
    'enums/events',
    'enums/debugCommands',
    'core/token',
    'core/debug'
], (PubSub, pako, alertify, EVENTS, DEBUG_COMMANDS, TokenProvider, debug) => {
    var token = TokenProvider.get(),
        messageIdStore = null,
        lostPackages = 0,
        bytesSent = 0,
        logNextMessage = false;

    function getProtocol(){
        return location.protocol === 'https:' ? 'wss' : 'ws';
    }

    debug.registerCommand(DEBUG_COMMANDS.SHOW_MESSAGE, () => {
        logNextMessage = true;
    });

    function genericConnect(){
        const ws = new WebSocket(`${getProtocol()}://${location.host}?token=${token}`);

        ws.onopen = () => {
            alertify.log('Connection established');
        }

        ws.onclose = () => {
            alertify.delay(0).closeLogOnClick(true).error('Connection lost');
        }

        ws.onmessage = (payload, flags) => {
            const message = JSON.parse(pako.inflate(payload.data, { to: 'string' }));
            const messageId = message.id;

            if (messageId){
                if (messageIdStore && messageId - messageIdStore > 1){
                    lostPackages ++;
                    document.querySelector('#lost').textContent = `| ${lostPackages} Lost`;
                }

                messageIdStore = messageId;
            }

            PubSub.publish(message.subject, Object.assign(message, {
                _length: payload.data.length
            }));

            if (logNextMessage){
                console.log(`Received: "${message.subject}"`);
                console.log(JSON.stringify(message, null, 2));

                logNextMessage = false;
            }
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
