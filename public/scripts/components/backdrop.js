define([
    'pixi'
], (PIXI) => {
    return function Backdrop(options){
        options = options || {};

        const backdrop = new PIXI.Graphics();

        backdrop.beginFill(options.color || 0x000000);
        backdrop.drawRect(0, 0, window.innerWidth, window.innerHeight);
        backdrop.endFill();

        backdrop.kind = 'backdrop';

        backdrop.onUpdate = function(){
            this.x = - options.container.x;
            this.y = - options.container.y;
        }

        if (typeof options.click === 'function'){
            backdrop.interactive = true;
            backdrop.click = options.click;
        }

        return backdrop;
    }
});
