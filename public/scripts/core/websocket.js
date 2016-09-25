define(() => {
    function genericConnect(){
        const ws = new WebSocket(`ws://${location.host}`);

        ws.onopen = function () {
            ws.send('something111');
        }

        ws.onmessage = function (data, flags) {
            const payload = JSON.parse(data.data);
            console.log(`=> "${payload.subject}" :: ${payload.message}`);

            PubSub.publish(payload.subject, payload);
        }

        return ws;
    }

    return {
        genericConnect: genericConnect
    };
});
