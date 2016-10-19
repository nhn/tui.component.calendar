'use strict';
/*eslint-disable*/
var path = require('path');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var KarmaServer = require('karma').Server;

var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var header = require('gulp-header');

var pkg = require('./package.json');
var filename = pkg.name.replace('tui-component-', '');
var banner = ['/**',
    ' * <%= pkg.name %>',
    ' * @author <%= pkg.author %>',
    ' * @version v<%= pkg.version %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

/**
 * Paths
 */
var SOURCE_DIR = './src/**/*',
    ENTRY = 'index.js',
    DIST = './dist',
    SAMPLE_DIST = './samples/js';

/**
 * Configuration
 */
var config = {};
config.browserify = {
    entries: ENTRY
};
config.browserSync = {
    server: {
        index: './sample3.html',
        baseDir: './samples'
    },
    port: 3000,
    ui: {
        port: 3001
    }
};
config.browserSyncStream = {
    once: true
};
config.watchify = Object.assign({}, watchify.args, config.browserify);

/**
 * Bundle function
 */
function bundle(bundler) {
    return bundler
        .bundle()
        .on('error', function(err) {
            console.log(err.message);
            browserSync.notify('Browserify Error');
            this.emit('end');
        })
        .pipe(source(filename + '.js'))
        .pipe(buffer())
        .pipe(header(banner, {pkg : pkg}))
        .pipe(gulp.dest(DIST))
        .pipe(gulp.dest(SAMPLE_DIST))
        .pipe(gulpif(
            browserSync.active,
            browserSync.stream(config.browserSyncStream))
        );
}

/**
 * Tasks
 */
gulp.task('watch', function() {
    var bundler = watchify(browserify(config.watchify)),
        watcher = function() {
            bundle(bundler);
        };

    browserSync.init(config.browserSync);
    bundler.on('update', watcher);
    bundler.on('log', gutil.log);

    watcher();
});

gulp.task('connect', function() {
    connect.server();
    gulp.watch(SOURCE_DIR, ['bundle']);
});

gulp.task('eslint', function() {
    return gulp.src([SOURCE_DIR])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('karma', ['eslint'], function(done) {
    new KarmaServer({
        configFile: path.join(__dirname, 'karma.conf.js'),
        singleRun: true,
        logLevel: 'error'
    }, done).start();
});

gulp.task('bundle', ['eslint', 'karma'], function() {
    return bundle(browserify(config.browserify));
});

gulp.task('compress', ['eslint', 'karma', 'bundle'], function() {
    gulp.src(filename + '.js')
        .pipe(uglify())
        .pipe(header(banner, {pkg : pkg}))
        .pipe(concat(filename + '.min.js'))
        .pipe(gulp.dest(DIST));
});

gulp.task('default', ['eslint', 'karma', 'bundle', 'compress']);
