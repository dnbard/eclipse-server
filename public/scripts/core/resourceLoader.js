define([
    'pixi',
    'core/resourceMetadata'
], function(PIXI, metadata){
    function resourceLoader(){
        const loader = PIXI.loader;
        const files = metadata.map(d => `/public/images/${d.filename}`);

        return PIXI.loader
            .add('/public/particles/particle.png')
            .add('/public/particles/fire.png')
            .add(files)
            .on('progress', loadProgressHandler);
    }

    function loadProgressHandler(loader, resource) {
        console.log(`Loading: ${resource.url} (${loader.progress.toFixed(0)} %)`);
    }

    return resourceLoader;
});
