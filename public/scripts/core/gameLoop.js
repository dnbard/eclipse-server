define([
    'lodash',
    'pubsub',
    'models/stage',
    'enums/events'
], (_, PubSub, Stage, EVENTS) => {
    function startGameLoop(data){
        stage = data.stage;
        renderer = data.renderer;

        gameLoop();

        function gameLoop(){
            requestAnimationFrame(gameLoop);

            updateLoopIterator(stage._camera);
            stage.children.forEach(updateLoopIterator)

            renderer.render(stage);
        }

        function updateLoopIterator(el){
            if (el && el.onUpdate && typeof el.onUpdate === 'function'){
                el.onUpdate.call(el);
            }
        }

        PubSub.subscribe(EVENTS.STAGE.UPDATED, function(event, payload){
            const newStageState = payload.message.stage;

            if (!stage || newStageState.id !== stage.id){
                return;
            }

            newStageState.actors.forEach(ActorIterator);

            const newStageActorsIds = _.map(newStageState.actors, MapById);
            const oldStageActorsIds = _.map(stage.children, MapById);

            //find new entities and add them to the scene
            const newEntities = _.difference( newStageActorsIds, oldStageActorsIds );
            newEntities.forEach(id => {
                if (!id){
                    return;
                }

                const actor = _.find(newStageState.actors, a => a.id === id);

                if (!actor){
                    return;
                }

                const actorComponent = Stage.createGenericActor(actor);
                stage.addChild(actorComponent);
            });

            //find missing entities and remove them from the scene
            const entitiesToRemove = _.difference( oldStageActorsIds, newStageActorsIds );
            entitiesToRemove.forEach(id => {
                if (!id){
                    return;
                }

                const actor = _.find(stage.children, a => a.id === id);
                stage.removeChild(actor);
            });
        });

        function ActorIterator(actor){
            const localActor = stage.children.find(a => a.id == actor.id);

            if (!localActor){
                return;
            }

            localActor.x = actor.x;
            localActor.y = actor.y;
        }

        function MapById(el){
            return el.id;
        }
    }

    return {
        startGameLoop: startGameLoop
    };
});
