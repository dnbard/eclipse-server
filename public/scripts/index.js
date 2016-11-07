requirejs.config({
    paths:{
        'templates': '../templates',
        'images': '../images',
        'pixi': 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.0.2/pixi',
        'pixi-particles': './vendor/pixiParticles',
        'particles': '../particles',
        'pubsub': 'https://cdnjs.cloudflare.com/ajax/libs/pubsub-js/1.5.3/pubsub',
        'lodash': 'https://cdn.jsdelivr.net/lodash/4.16.2/lodash.min',
        'pako': 'https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.3/pako.min'
    }
});

define([
    'pixi',
    'pubsub',
    'graph/renderer',
    'core/websocket',
    'core/gameLoop',
    'core/resourceLoader',
    'core/tokenCheck',
    'models/stage',
    'enums/events',

    'components/summary'
], (PIXI, PubSub, Renderer, websocket, GameLoop, ResourceLoader, tokenCheck, Stage, EVENTS) => {
    tokenCheck().then((user) => {
        ResourceLoader().load(() => {
            websocket.genericConnect();

            const token = PubSub.subscribe(EVENTS.CONNECTION.OPEN, (e, payload) => {
                const renderer = Renderer.create();
                const stage = Stage.createDefault({
                    init: payload.message
                });

                GameLoop.startGameLoop({
                    stage: stage,
                    renderer: renderer
                });

                PubSub.unsubscribe(token);

                document.querySelector('#version').textContent = `${payload.message.application.title} v${payload.message.application.version}`;
            });
        });
    }).catch(() => {
        location.href = '/';
    });
});
