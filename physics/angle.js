exports.getAngleBetweenTwoPoints = function(x1, y1, x2, y2){
    if (typeof x1 !== 'number' ||
        typeof x2 !== 'number' ||
        typeof y1 !== 'number' ||
        typeof y2 !== 'number' ){
            throw new TypeError(
                `Invalid arguments: all arguments should be a numbers instead of [${
                    [ typeof x1, typeof x2, typeof y1, typeof y2 ].join(', ')
                }]`
            );
        }

    return Math.atan2(y2 - y1, x2 - x1);
}
