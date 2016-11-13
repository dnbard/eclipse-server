requirejs.config({
    paths:{
        'templates': '../templates',
        'images': '../images',
        'pixi': 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.0.2/pixi',
        'pixi-particles': './vendor/pixiParticles',
        'particles': '../particles',
        'pubsub': 'https://cdnjs.cloudflare.com/ajax/libs/pubsub-js/1.5.3/pubsub',
        'lodash': 'https://cdn.jsdelivr.net/lodash/4.16.2/lodash.min',
        'pako': 'https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.3/pako.min',
        'ko': 'https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min'
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
    'components/buffs',
    'ui/main',

    'components/summary'
], (PIXI, PubSub, Renderer, websocket, GameLoop, ResourceLoader, tokenCheck, Stage, EVENTS, BuffsComponent, UIComponent) => {
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

            BuffsComponent.init('#buffs');
            UIComponent.init('#ui');
        });
    }).catch(() => {
        location.href = '/';
    });
});
