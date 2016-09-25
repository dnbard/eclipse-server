define([
    'core/gameLoop',
    'models/planet'
], (gameLoop, Planet) => {
    var initialized = false;

    function init() {
        if (initialized) {
            throw new Error('Renderer already initialized');
        }

        const renderer = PIXI.autoDetectRenderer(256, 256, {
            antialias: false,
            transparent: false,
            resolution: 1
        });

        renderer.view.style.position = "absolute";
        renderer.view.style.display = "block";
        renderer.autoResize = true;
        renderer.resize(window.innerWidth, window.innerHeight);

        //Add the canvas to the HTML document
        document.body.appendChild(renderer.view);

        //Create a container object called the `stage`
        const stage = new PIXI.Container();
        stage.addChild(Planet());


        gameLoop.startGameLoop({
            stage: stage,
            renderer: renderer
        });

        initialized = true;
    }

    return {
        init: init
    };
});
