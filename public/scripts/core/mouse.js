define(function(){
    var position = { x: 0, y: 0 };

    return {
        get: function(){
            return position;
        },
        set: function(x, y){
            position.x = x;
            position.y = y;
        }
    }
})
