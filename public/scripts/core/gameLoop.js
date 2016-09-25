define([], () => {
    function startGameLoop(data){
        stage = data.stage;
        renderer = data.renderer;

        gameLoop();

        function gameLoop(){
            requestAnimationFrame(gameLoop);

            stage.children.forEach(updateLoopIterator)

            renderer.render(stage);
        }

        function updateLoopIterator(el){
            if (el.onUpdate && typeof el.onUpdate === 'function'){
                el.onUpdate.call(el);
            }
        }
    }

    return {
        startGameLoop: startGameLoop
    };
});
