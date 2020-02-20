const gulp = require('gulp');
const gulpRename = require('gulp-rename');
const del = require('delete');

function clean(cb) {
    return del([ 'public/vendor/**/*.*' ], cb);
}

function scripts(){
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',
    ])
    .pipe(gulp.dest('public/vendor/jquery'));
}

function bootstrap(){
    return gulp.src([
        'node_modules/bootstrap/dist/**/*.*',
        '!node_modules/bootstrap/dist/**/*.min.*'
    ])
    .pipe(gulp.dest('public/vendor/bootstrap'));
}

function axios(){
    return gulp.src([
        'node_modules/axios/dist/**/*.*',
        '!node_modules/axios/dist/**/*.min.*'
    ])
    .pipe(gulp.dest('public/vendor/axios'));
}

const build = gulp.series(clean, scripts, bootstrap, axios);

exports.scripts = scripts;
exports.bootstrap = bootstrap;
exports.axios = axios;

exports.default = build;