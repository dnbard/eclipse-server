define([
    'models/planet'
],(Planet) => {
    function createDefault(options){
        const stage = new PIXI.Container();
        options = options || {};

        if (typeof options.init === 'object' && typeof options.init.stage === 'object' && typeof options.init.stage.actors === 'object'){
            options.init.stage.actors.forEach(function(el){
                var constructor = null;

                if (el.kind === 'planet'){
                    constructor = Planet;
                }

                if (!constructor){
                    return console.info(`Unknown element with kind=${el.kind}`);
                }

                const sprite = constructor();

                sprite.x = el.x || 0;
                sprite.y = el.y || 0;
                sprite.vx = el.vx || 0;
                sprite.vy = el.vy || 0;

                stage.addChild(sprite);
            });
        }

        return stage;
    }


    return {
        createDefault: createDefault
    }
});
