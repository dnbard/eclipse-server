//(function () {
//    const ws = new WebSocket(`ws://${location.host}`);
//
//    ws.onopen = function () {
//        ws.send('something');
//    }
//
//    ws.onmessage = function (data, flags) {
//        // flags.binary will be set if a binary data is received.
//        // flags.masked will be set if the data was masked.
//
//        const el = document.querySelector('main');
//        el.textContent = data.data;
//    }
//})();

define([
    'graph/renderer'
], (renderer) => {
    console.log('Started');

    PIXI.loader
        .add('/public/images/planet-eE6w1yk0880.png')
        .on('progress', loadProgressHandler)
        .load(renderer.init);
});

function loadProgressHandler(loader, resource) {

    //Display the file `url` currently being loaded
    console.log("loading: " + resource.url);

    //Display the precentage of files currently loaded
    console.log("progress: " + loader.progress + "%");

    //If you gave your files names as the first argument
    //of the `add` method, you can access them like this
    //console.log("loading: " + resource.name);
}
