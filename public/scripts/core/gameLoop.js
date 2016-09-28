define([
    'pubsub'
], (PubSub) => {
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

        PubSub.subscribe('eclipse.stage.update', function(event, payload){
            const newStageState = payload.message.stage;

            if (!stage /*|| newStageState.id !== stage.id*/){
                return;
            }

            newStageState.actors.forEach(ActorIterator);
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
