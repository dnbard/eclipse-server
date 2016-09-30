exports.get2DVelocity = function(angle, velocity){
    return {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity
    }
}
