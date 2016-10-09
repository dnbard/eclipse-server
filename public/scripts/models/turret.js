define([
    'pixi',
    'core/mouse'
], function(PIXI, Mouse){
    function onUpdate(){
        const mousePosition = Mouse.get();
        const angle = Math.atan2(mousePosition.y - this.y - this._parent.y, mousePosition.x - this.x - this._parent.x);
        this.rotation = angle + Math.PI * 0.5 - this._parent.rotation;
    }

    return function(options){
        const texture = PIXI.loader.resources['/public/images/turret-01.png']
            .texture;
        const turret = new PIXI.Sprite(texture);

        turret.anchor.x = 0.5;
        turret.anchor.y = 0.5;

        turret.x = options.x;
        turret.y = options.y;

        turret._parent = options.parent;

        if (options.isControllable){
            turret.onUpdate = onUpdate;
        } else {
            turret.onUpdate = null;
        }

        return turret;
    }
});
