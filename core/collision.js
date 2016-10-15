const GEOMETRY = require('../enums/geometry');

function checkStage(stage){
    const actors = stage.actors;

    for(var firstActorIndex in actors){
        var firstActor = actors[firstActorIndex];

        if (!firstActor.geometry){
            continue;
        }

        for(var secondActorIndex in actors){
            var secondActor = actors[secondActorIndex];

            if (!secondActor.geometry || firstActor === secondActor || (!firstActor.onCollide && !secondActor.onCollide)){
                continue;
            }

            var collisionChecker = getGeometryFunction(firstActor.geometry, secondActor.geometry);

            if (typeof collisionChecker !== 'function'){
                continue;
            }
            var collisionResult = collisionChecker(firstActor, secondActor);

            if (collisionResult){
                if (typeof firstActor.onCollide === 'function'){
                    firstActor.onCollide(secondActor, stage);
                }

                if (typeof secondActor.onCollide === 'function'){
                    secondActor.onCollide(firstActor, stage);
                }
            }
        }
    }
}

function getGeometryFunction(firstActorGeometry, secondActorGeometry){
    if (firstActorGeometry === GEOMETRY.POINT && secondActorGeometry === GEOMETRY.POINT){
        return colliderPointPoint;
    } else if ((firstActorGeometry === GEOMETRY.POINT && secondActorGeometry === GEOMETRY.CIRCLE) ||
              (firstActorGeometry === GEOMETRY.CIRCLE && secondActorGeometry === GEOMETRY.POINT)){
        return colliderCirclePoint;
    }/* else if (firstActorGeometry === GEOMETRY.CIRCLE && secondActorGeometry === GEOMETRY.CIRCLE){
        return colliderCircleCircle;
    }*/

    return null;
}

function colliderPointPoint(firstActor, secondActor){
    return firstActor.x === secondActor.x && firstActor.y === secondActor.y;
}

function colliderCirclePoint(firstActor, secondActor){
    var circle, point;

    if (firstActor.geometry === GEOMETRY.POINT){
        point = firstActor;
        circle = secondActor;
    } else {
        point = secondActor;
        circle = firstActor;
    }

    const distance = Math.sqrt( Math.pow(circle.x - point.x, 2) + Math.pow(circle.y - point.y, 2) );

    return distance < circle.size;
}

module.exports = {
    checkStage: checkStage,
    getGeometryFunction: getGeometryFunction,
    colliderPointPoint: colliderPointPoint,
    colliderCirclePoint: colliderCirclePoint
};
