let gulp = require('gulp');
let ts = require('gulp-typescript');
let concat = require('gulp-concat');
let tsProject = ts.createProject("tsconfig.json");

gulp.task('default', function () {
    let result = tsProject.src()
        .pipe(tsProject());

    result.js.pipe(concat('lib.js'))
        .pipe(gulp.dest('./dist'));
    result.dts.pipe(concat('lib.d.ts'))
        .pipe(gulp.dest('./dist'));
});