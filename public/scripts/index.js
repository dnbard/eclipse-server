(function () {
    const ws = new WebSocket(`ws://${location.host}`);

    ws.onopen = function () {
        ws.send('something');
    }

    ws.onmessage = function (data, flags) {
        // flags.binary will be set if a binary data is received.
        // flags.masked will be set if the data was masked.

        const el = document.querySelector('main');
        el.textContent = data.data;
    }
})();
