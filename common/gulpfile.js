const browserify = require("browserify");
const tsify = require("tsify");
const gulp = require('gulp');
const path = require('path');
const   source     = require('vinyl-source-stream');
const  buffer     = require('vinyl-buffer');
let ts = require('gulp-typescript');
let uglify = require('gulp-uglify');

gulp.task('default', function(){


    /*browserify()
        .add("src/ts/index.ts")
        .plugin("tsify", { noImplicitAny: true, target: 'es5', module: 'commonjs' })
        .bundle()
        .pipe(source('.'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(path.resolve('dist', 'index.js')));
        */

    let tsProject = ts.createProject('tsconfig.json');

    let tsResult = gulp.src('src/ts/*.ts')
        .pipe(tsProject());
    tsResult.dts.pipe(gulp.dest('./dist'));
    tsResult.js.pipe(gulp.dest('./dist'));
    /*

        let tsProject = ts.createProject("tsconfig.json");

        let result = tsProject.src()
            .pipe(ts());

        result.js.pipe(concat('index.js'))
            .pipe(gulp.dest('./dist'));
        result.dts
            .pipe(gulp.dest('./dist'));
        gulp.src('src/ts/index.d.ts').pipe(gulp.dest('./dist'))
    */
});