function getAction(actionName){
    return require(`./${actionName}`);
}

function execute(actionName, context, ...args){
    const action = getAction(actionName);
    if (typeof action !== 'function'){
        throw new Error(`Action(path=${actionName}) aren't a function`);
    }

    return action.apply(context || null, args);
}

module.exports = {
    getAction: getAction,
    execute: execute
};
