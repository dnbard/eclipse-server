const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');

gulp.task('default', function () {
    nodemon();

    return gulp.watch([
        './tests/**/*Spec.js',
        './**/*.js'
    ], ['test']);
});

gulp.task('watch', ['test'], function () {
    return gulp.watch([
        './tests/**/*Spec.js',
        './**/*.js'
    ], ['test']);
});

gulp.task('test', function(cb){
    require('./tests/mocha.init')(db => {
        return gulp.src('./tests/**/*Spec.js', {
            read: false
        }).pipe(mocha({ }))
            .on('error', (e) => {
                console.log(e);
            }).on('end', () => {
                cb();
                process.exit(0);
            });
    });
});
