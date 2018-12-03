const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const path = require('path');
const buffer = require('vinyl-buffer');
const replace = require('gulp-replace');
const addsrc = require('gulp-add-src');
const minify = require('gulp-minify');
const parseArgs = require('minimist');
const rename = require("gulp-rename");
const gulpSequence = require('gulp-sequence');
const fs = require('fs');
const concat = require('gulp-concat');

const args = parseArgs(process.argv.slice(2));


// needed for packaging the vendor.js
const thirdPartyLibraries = [];


let paths = {
    pages: ['src/*.html'],
    res: ['src/res/**/*'],
    dist: 'dist',
    resC: {
        resFolderName: 'res',
        fontFolderName: 'fonts'
    },
    js: {
        bundleUnminified: 'bundle',
        minifySourceSuffix: '-debug.js',
        minifySuffix: '-min.js',
        finalApplicationName: 'source',
        vendorUnminified: 'third-party',
        vendorFinalName: 'vendor',
    }
};

let config = {
    production: !!args.production
};


gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest(path.resolve(paths.dist)));
});

gulp.task('copy-res', function () {
    return gulp.src(paths.res).pipe(gulp.dest(path.resolve(paths.dist, paths.resC.resFolderName)))
});

gulp.task('copy-resources', gulpSequence(['copy-html', 'copy-res']));

gulp.task('minify-application-javascript', function () {
    let stream = gulp.src(path.resolve(paths.dist, paths.js.bundleUnminified + '.js'));
    if (config.production) {
        stream = stream.pipe(minify({
            ext: {
                src: paths.js.minifySourceSuffix,
                min: paths.js.minifySuffix
            }
        }))
    }
    return stream.pipe(gulp.dest(paths.dist))
});

gulp.task('rename-application-js-file', function () {
    return gulp.src(config.production ? path.resolve(paths.dist, paths.js.bundleUnminified + paths.js.minifySuffix) : path.resolve(paths.dist, paths.js.bundleUnminified + '.js'))
        .pipe(rename(paths.js.finalApplicationName + '.js'))
        .pipe(gulp.dest(paths.dist))
});

gulp.task('bundle-third-party-libraries', function () {
    const b = browserify({
        debug: true
    });

    thirdPartyLibraries.forEach(lib => {
        b.require(lib);
    });

    return b.bundle()
        .pipe(source(paths.js.vendorUnminified + '.js'))
        .pipe(buffer())
        .pipe(concat(paths.js.vendorUnminified + '.js'))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('minify-vendor-javascript', function () {
    let stream = gulp.src(path.resolve(paths.dist, paths.js.vendorUnminified + '.js'));
    if (config.production) {
        stream = stream.pipe(minify({
            ext: {
                src: paths.js.minifySourceSuffix,
                min: paths.js.minifySuffix
            }
        }))
    }
    return stream.pipe(gulp.dest(paths.dist))
});


gulp.task('rename-vendor-js-file', function () {
    return gulp.src(config.production ? path.resolve(paths.dist, paths.js.vendorUnminified + paths.js.minifySuffix) : path.resolve(paths.dist, paths.js.vendorUnminified + '.js'))
        .pipe(rename( paths.js.vendorFinalName +'.js'))
        .pipe(gulp.dest(paths.dist))
});


gulp.task('typescript-to-js', [], function () {
    return browserify()
        .add(path.resolve('src', 'ts', 'main.ts'))
        .external(thirdPartyLibraries)
        .plugin("tsify", {
            noImplicitAny: false,
            allowJs: true,
            target: 'es5',
            module: 'commonjs',
            global: true,
            lib: ["es2015.promise", "es2015", "dom", "ScriptHost"]
        })
        .bundle()
        .pipe(source('.'))
        .pipe(buffer())
        .pipe(gulp.dest(path.resolve(paths.dist, paths.js.bundleUnminified + '.js')));

});

gulp.task('clean', function(){
    if(config.production){
        fs.unlinkSync(path.resolve(paths.dist, paths.js.bundleUnminified + '.js'));
        fs.unlinkSync(path.resolve(paths.dist, paths.js.bundleUnminified + paths.js.minifySourceSuffix));
        fs.unlinkSync(path.resolve(paths.dist, paths.js.bundleUnminified + paths.js.minifySuffix));
        fs.unlinkSync(path.resolve(paths.dist, paths.js.vendorUnminified + '.js'));
        fs.unlinkSync(path.resolve(paths.dist, paths.js.vendorUnminified + paths.js.minifySourceSuffix));
        fs.unlinkSync(path.resolve(paths.dist, paths.js.vendorUnminified + paths.js.minifySuffix));
    }
});

gulp.task('concat-all-css', function(){
    return gulp.src( [
        path.resolve('src', 'css' , 'app.css')
    ])
        .pipe(concat('main.css'))
        .pipe(gulp.dest(path.resolve(paths.dist)))
});


gulp.task('concat-help-css', function(){
    return gulp.src( [
        path.resolve('src', 'css' , 'help.css')
    ])
        .pipe(concat('help.css'))
        .pipe(gulp.dest(path.resolve(paths.dist)))
});

gulp.task('third-party-libraries', gulpSequence('bundle-third-party-libraries', 'minify-vendor-javascript', 'rename-vendor-js-file'));

gulp.task('application-javascript', gulpSequence('typescript-to-js', 'minify-application-javascript', 'rename-application-js-file'));
gulp.task('process-css', gulpSequence('concat-all-css', 'concat-help-css'));


gulp.task('default', gulpSequence(['application-javascript', 'copy-resources', 'third-party-libraries', 'process-css'], 'clean'));