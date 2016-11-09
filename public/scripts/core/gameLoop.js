define([
    'lodash',
    'pubsub',
    'models/stage',
    'enums/events'
], (_, PubSub, Stage, EVENTS) => {
    function startGameLoop(data){
        const stage = data.stage;
        const renderer = data.renderer;
        const filterStrength = 5;
        var frameTime = 0, lastLoop = new Date, thisLoop;
        var uframeTime = 100, ulastLoop = new Date, uthisLoop;
        var received = 0;

        gameLoop();

        function gameLoop(delta){
            requestAnimationFrame(gameLoop);

            stage.children.forEach(updateLoopIterator);
            updateLoopIterator(stage._camera);
            updateLoopIterator(stage._backdrop);

            renderer.render(stage);

            const thisFrameTime = (thisLoop=new Date) - lastLoop;
            frameTime += (thisFrameTime - frameTime) / filterStrength;
            lastLoop = thisLoop;
        }

        const fpsOut = document.getElementById('fps');
        const latencyOut = document.getElementById('latency');
        const receivedOut = document.getElementById('received');
        setInterval(function(){
            fpsOut.textContent = `| ${(1000 / frameTime).toFixed(0)} fps`;
            latencyOut.textContent = `| ${Math.round(uframeTime)}ms`;
            receivedOut.textContent = received < 100000 ?
                `| ⬇${(received / 1000).toFixed(0)}KB` :
                `| ⬇${(received / 1000000).toFixed(1)}MB`;
        },1000);

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

                const actorComponent = Stage.createGenericActor(actor, stage);
                stage.addChild(actorComponent);
            });

            //find missing entities and remove them from the scene
            const entitiesToRemove = _.difference( oldStageActorsIds, newStageActorsIds );
            entitiesToRemove.forEach(id => {
                if (!id){
                    return;
                }

                const actor = _.find(stage.children, a => a.id === id);
                if (typeof actor.onDestroy === 'function'){
                    actor.onDestroy.call(actor, stage);
                }
                stage.removeChild(actor);
            });

            const thisFrameTime = (uthisLoop=new Date) - ulastLoop;
            uframeTime+= (thisFrameTime - uframeTime) / filterStrength;
            ulastLoop = uthisLoop;

            received += payload._length;
        });

        function ActorIterator(actor){
            const localActor = stage.children.find(a => a.id == actor.id);

            if (!localActor){
                return;
            }

            if (typeof localActor.applyUpdate === 'function'){
                localActor.applyUpdate.call(localActor, actor);
            } else {
                localActor.x = actor.x;
                localActor.y = actor.y;
            }
        }

        function MapById(el){
            return el.id;
        }
    }

    return {
        startGameLoop: startGameLoop
    };
});
