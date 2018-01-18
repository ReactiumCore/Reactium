
const del              = require('del');
const fs               = require('fs');
const path             = require('path');
const webpack          = require('webpack');
const browserSync      = require('browser-sync');
const runSequence      = require('run-sequence');
const gulp             = require('gulp');
const gulpif           = require('gulp-if');
const prefix           = require('gulp-autoprefixer');
const sass             = require('gulp-sass');
const less             = require('gulp-less');
const csso             = require('gulp-csso');
const sourcemaps       = require('gulp-sourcemaps');
const env              = require('yargs').argv;
const config           = require('./gulp.config')();
const nodemon          = require('nodemon');

// Update config from environment variables
config.port.browsersync = (env.hasOwnProperty('APP_PORT')) ? env.APP_PORT : config.port.browsersync;
config.env = (env.hasOwnProperty('environment')) ? env.environment : config.env;

// Set webpack config after environment variables
const webpackConfig    = require('./webpack.config')(config);
const webpackConfigServer    = require('./webpack.config')(config, 'server');

// Compile js
gulp.task('scripts', (done) => {

    let cnt = 2;

    webpack(webpackConfig, (err, stats) => {
        if (err) {
            console.log(err());
            cnt -= 1;
            if (cnt <= 0) { done(); }
            return;
        }

        let result = stats.toJson();

        if (result.errors.length > 0) {
            result.errors.forEach((error) => {
                console.log(error);
            });
            cnt -= 1;
            if (cnt <= 0) { done(); }
            return;
        }

        cnt -= 1;
        if (cnt <= 0) {
            if (config.env === 'development') {
                browserSync.reload();
            }

            done();
        }
    });
    webpack(webpackConfigServer, (err, stats) => {
        if (err) {
            console.log(err());
            cnt -= 1;
            if (cnt <= 0) { done(); }
            return;
        }

        let result = stats.toJson();

        if (result.errors.length > 0) {
            result.errors.forEach((error) => {
                console.log(error);
            });
            cnt -= 1;
            if (cnt <= 0) { done(); }
            return;
        }

        cnt -= 1;
        if (cnt <= 0) {
            if (config.env === 'development') {
                browserSync.reload();
            }

            done();
        }
    });
});

// Sass styles
gulp.task('styles', () => {
    let isDev     = (config.env === 'development');
    let isSass    = (config.cssPreProcessor === 'sass');
    let isLess    = (config.cssPreProcessor === 'less');

    return gulp.src(config.src.style)
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(gulpif(isSass, sass({includePaths: config.src.includes}).on('error', sass.logError)))
    .pipe(gulpif(isLess, less({paths: config.src.includes})))
    .pipe(prefix(config.browsers))
    .pipe(gulpif(!isDev, csso()))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest(config.dest.style))
    .pipe(gulpif(isDev, browserSync.stream()));
});

// Copy assets
gulp.task('assets', () => {
    let isDev = (config.env === 'development');
    return gulp.src(config.src.assets)
    .pipe(gulp.dest(config.dest.assets))
    .pipe(gulpif(isDev, browserSync.stream()));
});


gulp.task('assets:toolkit', () => {
    return gulp.src(config.src.toolkit.assets)
    .pipe(gulp.dest(config.dest.assets));
});

// Copy markup
gulp.task('markup', () => {
    let isDev = (config.env === 'development');
    return gulp.src(config.src.markup)
    .pipe(gulp.dest(config.dest.markup))
    .pipe(gulpif(isDev, browserSync.stream()));
});

// Remove all distribution files
gulp.task('clean', (done) => {
    del.sync([config.dest.dist]);
    done();
});

// Manages changes for a single file instead of a directory
const watcher = (e) => {
    let src     = path.relative(path.resolve(__dirname), e.path);
    let fpath    = `${config.dest.dist}/${path.relative(path.resolve(config.src.app), e.path)}`;
    let dest    = path.normalize(path.dirname(fpath));

    if (fs.existsSync(fpath)) {
        del.sync([fpath]);
    }

    if (e.type !== 'deleted') {
        gulp.src(src).pipe(gulp.dest(dest));
    }

    browserSync.reload();
    console.log(`[00:00:00] File ${e.type}: /${src}`);
};

// nodemon -> start server and reload on change
gulp.task('nodemon', (done) => {
    if (config.env !== 'development') { done(); return; }

    let callbackCalled = false;
    nodemon({
        watch : config.dest.server,
        env: {
            port: config.port.proxy
        },
        script: config.dest.server + '/index.js',
        ext: 'js ejs json jsx html css scss jpg png gif svg txt md'
    }).on('start', function () {
        if (!callbackCalled) {
            callbackCalled = true;
            done();
        }
    }).on('quit', () => {
        process.exit();
    }).on('restart', function () {
        console.log('[00:00:00] Server restarted');
    });
});

// Server locally
gulp.task('serve', () => {
    browserSync({
        notify: false,
        timestamps: true,
        logPrefix: '00:00:00',
        port: config.port.browsersync,
        ui: {port: config.port.browsersync + 1},
        proxy: `localhost:${config.port.proxy}`
    });

    gulp.watch(config.watch.js, ['scripts']);
    gulp.watch(config.watch.server, ['scripts']);
    gulp.watch(config.watch.templates, browserSync.reload);
    gulp.watch(config.watch.style, ['styles']);
    gulp.watch([config.watch.markup, config.watch.assets], watcher);
});

// Build
gulp.task('build', (done) => {
    runSequence(['clean'], ['assets', 'assets:toolkit', 'markup', 'styles'], ['scripts'], () => {
        done();
    });
});

// The default task
gulp.task('default', (done) => {
    if (config.env === 'development') {
        runSequence(['build'], ['nodemon'], () => {
            gulp.start('serve');
            done();
        });
    } else {
        runSequence(['build'], () => {
            done();
        });
    }
});
