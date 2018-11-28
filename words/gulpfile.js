
let gulp = require('gulp');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let watchify = require('watchify');
let tsify = require('tsify');
let gutil = require('gulp-util');
const path = require('path');
let cssConcat = require('gulp-concat-css');
let clean = require('gulp-clean');
const  buffer     = require('vinyl-buffer');



let paths = {
    pages: ['src/*.html'],
    res: ['src/res/**/*'],
    resC: {
        resFolderName: 'res'
    },
    dist: 'dist',
    commons: { css: './../common/css/*.css', img: './../common/img/**/*.*'},
    parts: 'parts/**/*'
};

gulp.task('concat-commons-css', function(){
    return gulp.src(paths.commons.css)
        .pipe(cssConcat('vendor.css'))
        .pipe(gulp.dest(path.resolve('dist', 'common', 'css')));
});

gulp.task('move-commons-img', function(){
    return gulp.src(paths.commons.img, { base: './' })
        .pipe(gulp.dest(path.resolve('dist', 'img')));
});


gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest(path.resolve('dist')));
});

gulp.task('concat-commons', function(){
    gulp.start('concat-commons-css');
    return gulp.start('move-commons-img');
});


gulp.task('clean', function(){
    return gulp.src('dist')
        .pipe(clean())
});

gulp.task('copy-res', function () {
    return gulp.src(paths.res).pipe(gulp.dest(path.resolve(paths.dist, paths.resC.resFolderName)))
});

function bundle() {
    browserify()
        .add("src/ts/main.ts")
        .plugin("tsify", { noImplicitAny: true, target: 'es5', module: 'commonjs', global: true, lib: ["es2015.promise", "es2015", "dom", "ScriptHost"]})
        .bundle()
        .pipe(source('.'))
        .pipe(buffer())
        .pipe(gulp.dest(path.resolve('dist', 'bundle.js')))
}

gulp.task('default', ['copy-html', 'concat-commons', 'copy-res'], bundle);

//watchedBrowserify.on('update', bundle);
//watchedBrowserify.on('log', gutil.log);

