requirejs.config({
    paths:{
        'templates': '../templates',
        'images': '../images',
        'pixi': 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.0.2/pixi',
        'pubsub': 'https://cdnjs.cloudflare.com/ajax/libs/pubsub-js/1.5.3/pubsub'
    }
});

define([
    'pixi',
    'pubsub',
    'graph/renderer',
    'core/websocket',
    'core/gameLoop',
    'core/resourceLoader',
    'models/stage'
], (PIXI, PubSub, Renderer, websocket, GameLoop, ResourceLoader, Stage) => {
    console.log('Started');

    ResourceLoader().load(() => {
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
