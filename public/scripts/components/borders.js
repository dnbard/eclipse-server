define([
    'pixi'
], (PIXI) => {
    return function Borders(options){
        options = options || {};

        const border = new PIXI.Graphics();
        const size = options.size || 10000;

        border.beginFill(options.color || 0x555555);
        border.drawRect(-size, 0, 2 * size, 1);
        border.drawRect(0, -size, 1, 2 * size);

        for (var i = -size; i < size; i += 100){
            border.drawRect(i, -3, 1, 6);
            border.drawRect(-3, i, 6, 1);
        }

        border.endFill();

        border.kind = 'border';

        return border;
    }
});
