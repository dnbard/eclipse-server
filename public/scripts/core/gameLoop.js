define([
    'pubsub',
    'enums/events'
], (PubSub, EVENTS) => {
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

            //TODO: find new entities and add them to the scene



            //TODO: find missing entities and remove them from the scene
        });

        function ActorIterator(actor){
            const localActor = stage.children.find(a => a.id == actor.id);

            if (!localActor){
                return;
            }

            localActor.x = actor.x;
            localActor.y = actor.y;
        }
    }

    return {
        startGameLoop: startGameLoop
    };
});
