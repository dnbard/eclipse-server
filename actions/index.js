const EMPTY_HANDLER = () => {};
const middlewares = new Map();

function getAction(actionName){
    return !actionName ? EMPTY_HANDLER :
        Array.isArray(actionName) ? getMiddleware(actionName) : require(`./${actionName}`);
}

function execute(actionName, context, ...args){
    const action = getAction(actionName);
    if (typeof action !== 'function'){
        throw new Error(`Action(path=${actionName}) aren't a function`);
    }

    return action.apply(context || null, args);
}

function getMiddleware(actionNames){
    if (!Array.isArray(actionNames)){
        throw new Error('"actionsNames" should be an array');
    }

    const hash = actionNames.join('.');

    if (!middlewares.has(hash)){
        const handlers = actionNames.map(getAction);
        const middleware = function(...args){
            const handlersCount = handlers.length;

            for(var i = 0; i< handlersCount; i++){
                handlers[i].call(this, ...args);
            }
        }
        middlewares.set(hash, middleware);
    }

    return middlewares.get(hash);
}

module.exports = {
    getAction: getAction,
    execute: execute
};
