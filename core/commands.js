const EVENTS = require('../public/scripts/enums/events');
const BUFFS = require('../enums/buffs');

var commands = {};

exports.execute = function(commandName, params){
    if (!commands[commandName]){
        throw new Error(`Command ${commandName} not registered.`);
    }

    //no commands available while in death state
    if(params && params.player && params.player.isBuffActive(BUFFS.DEATH)){
        return;
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

register(EVENTS.COMMANDS.PLAYER.ACCELERATE,
    p => p.player.isAccelerating = true);
register(EVENTS.COMMANDS.PLAYER.DECELERATE,
    p => p.player.isAccelerating = false);
register(EVENTS.COMMANDS.PLAYER.RADIAL_ACCELERATE,
    p => p.player.rotateDirection = -p.message.direction);
register(EVENTS.COMMANDS.PLAYER.RADIAL_DECELERATE,
    p => p.player.rotateDirection = 0);
register(EVENTS.COMMANDS.PLAYER.FIRE,
    p => p.player.firing = { x: p.message.x, y: p.message.y } );
register(EVENTS.COMMANDS.PLAYER.STOP_FIRE,
    p => p.player.firing = null);
