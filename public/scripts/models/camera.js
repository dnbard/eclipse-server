define([
    'pixi'
], function(PIXI){
    function onUpdate(){
        const container = this.container;
        const target = this.target;

        container.x = - target.x + this.centerX;
        container.y = - target.y + this.centerY;
    }

    function onDispose(){
        this.container = null;
        this.target = null;
    }

    return function Camera(options){
        const camera = {};

        camera.width = window.innerWidth;
        camera.height = window.innerHeight;

        camera.centerX = window.innerWidth * 0.5;
        camera.centerY = window.innerHeight * 0.5;

        camera.container = options.container;
        camera.target = options.target;

        if (!camera.container){
            throw new Error('Container should be defined');
        }

        if (!camera.target){
            throw new Error('Target should be defined');
        }

        camera.onUpdate = onUpdate;
        camera.onDispose = onDispose;

        return camera;
    }
});
