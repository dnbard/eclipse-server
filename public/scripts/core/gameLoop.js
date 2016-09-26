define([], () => {
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
    }

    return {
        startGameLoop: startGameLoop
    };
});
