var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var tsify = require('tsify');
var gutil = require('gulp-util');
const path = require('path');
var cssConcat = require('gulp-concat-css');
var clean = require('gulp-clean');


var paths = {
    pages: ['src/*.html'],
    commons: { css: './../common/css/*.css', img: './../common/img/**/*.*'}
};

gulp.task('concat-commons-css', function(){
    return gulp.src(paths.commons.css)
        .pipe(cssConcat('vendor.css'))
        .pipe(gulp.dest(path.resolve('dist', 'common', 'css')));
});

gulp.task('move-commons-img', function(){
    gulp.src(paths.commons.img, { base: './' })
        .pipe(gulp.dest(path.resolve('dist', 'img')));
});

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/ts/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest(path.resolve('dist')));
});

gulp.task('concat-commons', function(){
    gulp.start('concat-commons-css');
    gulp.start('move-commons-img');
});


gulp.task('clean', function(){
    return gulp.src('dist')
        .pipe(clean())
});

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(path.resolve('dist', 'js')));
}

gulp.task('default', ['copy-html', 'concat-commons'], bundle);

watchedBrowserify.on('update', bundle);
watchedBrowserify.on('log', gutil.log);