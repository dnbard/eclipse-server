const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');

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

gulp.task('test', ['pre-test'], function(cb){
    require('./tests/mocha.init')(db => {
        return gulp.src('./tests/**/*Spec.js', {
            read: false
        }).pipe(mocha({ })).on('error', (e) => {
            console.error(e);
        }).once('error', () => {
            process.exit(1);
        }).on('end', () => {
            setTimeout(() => {
               cb();
                process.exit(0);
            }, 10);
        }).pipe(istanbul.writeReports({
            dir: './coverage',
            reporters: [ 'lcovonly', 'text', 'text-summary' ],
            reportOpts: {
                lcov: { dir: 'lcovonly', file: 'lcov.info' }
            }
        }))
    });
});

gulp.task('pre-test', function () {
  return gulp.src([
      './controllers/*.js',
      './core/*.js',
      './data/*.js',
      './db/*.js',
      './enums/*.js',
      './generators/*.js',
      './middlewares/*.js',
      './models/*.js',
      './physics/*.js',
  ]).pipe(istanbul())
    .pipe(istanbul.hookRequire());
});
