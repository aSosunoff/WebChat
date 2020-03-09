const gulp = require('gulp');
const gulpRename = require('gulp-rename');
const del = require('delete');

function clean(cb) {
    return del([ 'public/vendor/**/*.*' ], cb);
}

function scripts(cb){
    gulp.src(['node_modules/jquery/dist/jquery.js'])
    .pipe(gulp.dest('public/vendor/jquery'));

    gulp.src([
        'node_modules/socket.io-client/dist/socket.io.js',
        'node_modules/socket.io-client/dist/socket.io.js.map'
    ])
    .pipe(gulp.dest('public/vendor/socket'));

    cb();
}

function bootstrap(cb){
    gulp.src([
        'node_modules/bootstrap/dist/**/*.*',
        '!node_modules/bootstrap/dist/**/*.min.*'
    ])
    .pipe(gulp.dest('public/vendor/bootstrap'));

    cb();
}

function axios(cb){
    gulp.src([
        'node_modules/axios/dist/**/*.*',
        '!node_modules/axios/dist/**/*.min.*'
    ])
    .pipe(gulp.dest('public/vendor/axios'));

    cb();
}

const build = gulp.series(clean, scripts, bootstrap, axios);

exports.scripts = scripts;
exports.bootstrap = bootstrap;
exports.axios = axios;

exports.default = build;