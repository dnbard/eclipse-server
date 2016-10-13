const EVENTS = require('../public/scripts/enums/events');
const Actor = require('../models/actor');
const Angle = require('../physics/angle');
const Velocity = require('../physics/velocity');

var commands = {};

exports.execute = function(commandName, params){
    if (!commands[commandName]){
        throw new Error(`Command ${commandName} not registered.`);
    }

    commands[commandName].call(null, params);
}

function register(commandName, command){
    if (commands[commandName]){
        throw new Error(`Command ${commandName} already registered.`);
    }

    commands[commandName] = command;
}

function unregisterAll(){
    commands = {};
}

exports.register = register;
exports.unregisterAll = unregisterAll;


const PROJECTILE_SPEED = 10;
const PROJECTILE_LIFETIME = 1200;

register(EVENTS.COMMANDS.PLAYER.ACCELERATE,
    p => p.player.isAccelerating = true);
register(EVENTS.COMMANDS.PLAYER.DECELERATE,
    p => p.player.isAccelerating = false);
register(EVENTS.COMMANDS.PLAYER.RADIAL_ACCELERATE,
    p => p.player.rotateDirection = -p.message.direction);
register(EVENTS.COMMANDS.PLAYER.RADIAL_DECELERATE,
    p => p.player.rotateDirection = 0);
register(EVENTS.COMMANDS.PLAYER.FIRE, p => {
    const angle = Angle.getAngleBetweenTwoPoints(
        p.player.x, p.player.y, p.message.x, p.message.y
    );
    const velocity = Velocity.get2DVelocity(angle, PROJECTILE_SPEED);
    const projectile = new Actor({
        kind: 'projectile',
        x: p.player.x,
        y: p.player.y,
        rotation: -angle,
        vx: velocity.x,
        vy: velocity.y,
        ttl: PROJECTILE_LIFETIME,
        onUpdate: 'defaultProjectile'
    });

    //todo: check last shot timestamp
    p.stage.addActor(projectile);
});