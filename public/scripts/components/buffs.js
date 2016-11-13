define([
    'pubsub',
    'enums/events'
], function(PubSub, EVENTS){
    var el = null;
    var buffs = [];

    const registeredBuffs = new Set(['sanctuary', 'death']);

    function init(selector){
        el = document.querySelector(selector);

        PubSub.subscribe(EVENTS.IDENTITY.BUFFS_CHANGED, (e, newBuffs) => {
            if (buffs.length === newBuffs.length){
                return;
            }

            buffs = newBuffs;

            el.innerHTML = buffs.map(b => {
                if (registeredBuffs.has(b)){
                    return `<div class="buff" data-id=${b}>
                        <img src="/public/images/ui/${b}.svg" width="48" />
                        <span>${b}</span>
                    </div>`;
                } else {
                    return `<div class="buff" data-id=${b}>
                        <img src="/public/images/ui/defaultBuff.svg" width="48" />
                        <span>${b}</span>
                    </div>`;
                }

            }).join('');
        });
    }

    return {
        init: init
    }
});
