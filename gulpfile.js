const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');

gulp.task('default', ['test'], function () {
    nodemon();

    return gulp.watch('./tests/**/*Spec.js', ['test']);
});

gulp.task('test', function(cb){
    require('./tests/mocha.init')(db => {
        return gulp.src('./tests/**/*Spec.js', {
            read: false
        }).pipe(mocha({ }))
            .on('error', () => {
                //handle the error (empty handler is enough)
            }).on('end', () => db.close(cb));
    });
});
