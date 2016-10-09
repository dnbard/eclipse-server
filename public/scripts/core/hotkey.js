define([
    'core/uuid'
], (uuid) => {
    const keys = {};

    function register(options){
        const keycode = options.keycode;

        const key = {
            code: keycode,
            isDown: false,
            isUp: true,
            onPress: options.onPress,
            onRelease: options.onRelease,
            id: uuid()
        }

        if (!keys[keycode]){
            keys[keycode] = [];
        }
        keys[keycode].push(key);

        return key;
    }

    window.addEventListener("keydown", e => {
        if (Array.isArray(keys[e.keyCode])){
            keys[e.keyCode].forEach(keydownIterator);
        }

        e.preventDefault();
    }, false);

    function keydownIterator(key){
        if (key.isUp && key.onPress) {
            key.onPress();
        }

        key.isDown = true;
        key.isUp = false;
    }

    window.addEventListener("keyup", e => {
        if (Array.isArray(keys[e.keyCode])){
            keys[e.keyCode].forEach(keyupIterator);
        }

        e.preventDefault();
    }, false);

    function keyupIterator(key){
        if (key.isDown && key.onRelease) {
            key.onRelease();
        }

        key.isDown = false;
        key.isUp = true;
    }

    return {
        register: register
    };
});
