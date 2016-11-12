let time = 0;

exports.increment = function(value){
    time += value;
}

exports.get = function(){
    return time;
}

exports.reset = function(){
    time = 0;
}
