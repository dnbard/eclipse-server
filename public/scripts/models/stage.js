define([
    'pixi',
    'models/planet',
    'models/player',
    'models/camera',
    'components/backdrop',
    'components/borders'
],(PIXI, Planet, Player, Camera, Backdrop, Borders) => {
    function getActorConstructor(kind){
        var constructor = null;

        if (kind === 'planet'){
            constructor = Planet;
        } else if (kind === 'player'){
            constructor = Player;
        }

        return constructor;
    }

    function createGenericActor(el){
        var constructor = getActorConstructor(el.kind);

        if (!constructor){
            return console.info(`Unknown element with kind=${el.kind}`);
        }

        const actor = constructor(el);

        actor.x = parseFloat(el.x) || 0;
        actor.y = parseFloat(el.y) || 0;
        actor.vx = actor.vx || parseFloat(el.vx) || 0;
        actor.vy = actor.vy || parseFloat(el.vy) || 0;

        return actor;
    }

    function createDefault(options){
        const stage = new PIXI.Container();
        options = options || {};

        stage.id = options.init.stage.id;

        stage.addChild(Backdrop({
            container: stage,
            click: (e) => {
                console.log(e.target);
            }
        }));

        stage.addChild(Borders());

        if (typeof options.init === 'object' && typeof options.init.stage === 'object' && typeof options.init.stage.actors === 'object'){
            options.init.stage.actors.forEach(el => stage.addChild(createGenericActor(el)));

            const camera = Camera({
                container: stage,
                target: stage.children.filter(c => c.id === options.init.actorId && c.kind === 'player')[0]
            });

            stage._camera = camera;
        }

        return stage;
    }


    return {
        createDefault: createDefault,
        getActorConstructor: getActorConstructor,
        createGenericActor: createGenericActor
    }
});
