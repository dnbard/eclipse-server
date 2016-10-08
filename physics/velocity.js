exports.get2DVelocity = function(angle, velocity){
    return {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity
    }
}

const RADIAL_VELOCITY_MOD = 0.75;
exports.getRadialVelocity = function(currentVelocity, maxVelocity, radialVelocity){
    return ( 1 - (currentVelocity / maxVelocity * RADIAL_VELOCITY_MOD) ) * radialVelocity;
}
