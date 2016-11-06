define([
    'pixi',
    'core/uuid',
    'pubsub',
    'enums/events',

    'pixi-particles'
], (PIXI, uuid, PubSub, EVENTS) => {
    function onDestroy(stage){
        this.particle.emit = false;
        stage.removeChild(this);
        this.particle.destroy();
    }

    function onUpdate(stage, delta){
        this.particle.update(20*0.001);
    }

    return function StaticParticle(options){
        const container = new PIXI.Container();

        container.particle = new PIXI.particles.Emitter(
            container, options.textures, options.particle);

        container.x = options.x || 0;
        container.y = options.y || 0;

        container.kind = 'static-particle';

        container.onDestroy = options.onDestroy || onDestroy;
        container.onUpdate = options.onUpdate || onUpdate;

        container.isPartricle = true;

        if (options.particle.emitterLifetime > 0){
            setTimeout(function(){
                PubSub.publish(EVENTS.STAGE.REMOVE_CHILD, {
                    stageId: options.stage.id,
                    child: container
                });
            }, options.particle.emitterLifetime * 3000);
        }

        return container;
    }
});
