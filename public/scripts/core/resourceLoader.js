define([
    'pixi',
    'core/resourceMetadata'
], function(PIXI, metadata){
    function resourceLoader(){
        const loader = PIXI.loader;
        const files = metadata.map(d => `/public/images/${d.filename}`);

        return PIXI.loader.add(files).on('progress', loadProgressHandler);
    }

    function loadProgressHandler(loader, resource) {
        console.log(`loading: ${resource.url} (${loader.progress.toFixed(0)} %)`);
    }

    return resourceLoader;
});