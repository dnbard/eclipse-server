define([
    'pixi',
    'models/planet',
    'models/player',
    'models/camera'
],(PIXI, Planet, Player, Camera) => {
    function createDefault(options){
        const stage = new PIXI.Container();
        options = options || {};

        if (typeof options.init === 'object' && typeof options.init.stage === 'object' && typeof options.init.stage.actors === 'object'){
            options.init.stage.actors.forEach(function(el){
                var constructor = null;

                if (el.kind === 'planet'){
                    constructor = Planet;
                } else if (el.kind === 'player'){
                    constructor = Player;
                }

                if (!constructor){
                    return console.info(`Unknown element with kind=${el.kind}`);
                }

                const sprite = constructor(el);

                sprite.x = parseFloat(el.x) || 0;
                sprite.y = parseFloat(el.y) || 0;
                sprite.vx = sprite.vx || parseFloat(el.vx) || 0;
                sprite.vy = sprite.vy || parseFloat(el.vy) || 0;

                stage.addChild(sprite);
            });

            const camera = Camera({
                container: stage,
                target: stage.children.filter(c => c.id === options.init.actorId && c.kind === 'player')[0]
            });

            stage._camera = camera;
        }

        return stage;
    }


    return {
        createDefault: createDefault
    }
});
