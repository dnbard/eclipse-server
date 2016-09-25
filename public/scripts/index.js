define([
    'graph/renderer',
    'core/websocket',
    'core/gameLoop',
    'models/stage'
], (Renderer, websocket, GameLoop, Stage) => {
    console.log('Started');

    PIXI.loader
        .add('/public/images/planet-eE6w1yk0880.png')
        .on('progress', loadProgressHandler)
        .load(() => {
            websocket.genericConnect();

            const token = PubSub.subscribe('eclipse.connection.open', (e, payload) => {
                const renderer = Renderer.create();
                const stage = Stage.createDefault({
                    init: payload.message
                });

                GameLoop.startGameLoop({
                    stage: stage,
                    renderer: renderer
                });

                PubSub.unsubscribe(token);
            });
        });
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
