define([
    'pixi',
    'core/uuid'
], (PIXI, uuid, PubSub, EVENTS) => {
    function onUpdate(stage, delta){
        this.lifetime -= 1;

        if (this.lifetime <= 0){
            stage.removeChild(this);
        }

        this.y -= 3;
    }

    return function FlyingNumber(options){
        const container = new PIXI.Container();

        container.x = options.x || 0;
        container.y = options.y || 0;

        container.kind = 'flying-number';
        container.type = options.type;

        const text = new PIXI.Text(options.text, {
            fontFamily : 'Nunito',
            fontSize: 16,
            fill : options.color || 0xffffff
        });

        container.lifetime = 75;

        container.addChild(text);

        container.onUpdate = options.onUpdate || onUpdate;

        return container;
    }
});
