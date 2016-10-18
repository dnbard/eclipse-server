const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');

gulp.task('default', ['test'], function () {
    nodemon({
        tasks: ['test'],
        delay: 10
    });
});

gulp.task('test', function(cb){
    require('./tests/mocha.init')(db => {
        return gulp.src('./tests/**/*Spec.js', {
            read: false
        }).pipe(mocha({ }))
            .on('end', () => db.close(cb));
    });
});
