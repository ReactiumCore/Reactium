
const del            = require('del');
const fs             = require('fs-extra');
const path           = require('path');
const webpack        = require('webpack');
const browserSync    = require('browser-sync');
const runSequence    = require('run-sequence');
const gulp           = require('gulp');
const gulpif         = require('gulp-if');
const gulpwatch      = require('gulp-watch');
const prefix         = require('gulp-autoprefixer');
const sass           = require('gulp-sass');
const less           = require('gulp-less');
const csso           = require('gulp-csso');
const sourcemaps     = require('gulp-sourcemaps');
const config         = require('./gulp.config')();
const chalk          = require('chalk');
const moment         = require('moment');
const regenManifest  = require('./manifest-tools');

const env = process.env.NODE_ENV || 'development';

// Update config from environment variables
config.port.browsersync = (process.env.hasOwnProperty('APP_PORT')) ? process.env.APP_PORT : config.port.browsersync;

const timestamp = () => {
    let now = moment().format('HH:mm:ss');
    return `[${chalk.blue(now)}]`;
};

// Set webpack config after environment variables
const webpackConfig    = require('./webpack.config')(config);

gulp.task('manifest', (done) => {
    regenManifest();
    done();
});

// Compile js
gulp.task('scripts', (done) => {
    let isDev = (env === 'development');

    if ( ! isDev ) {
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                console.log(err());
                done();
                return;
            }

            let result = stats.toJson();

            if (result.errors.length > 0) {
                result.errors.forEach((error) => {
                    console.log(error);
                });

                done();
                return;
            }

            done();
        });
    } else {
        done();
    }
});

// Sass styles
gulp.task('styles', () => {
    let isDev     = (env === 'development');
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
    return gulp.src(config.src.assets)
    .pipe(gulp.dest(config.dest.assets));
});


gulp.task('assets:toolkit', () => {
    return gulp.src(config.src.toolkit.assets)
    .pipe(gulp.dest(config.dest.assets));
});

// Copy markup
gulp.task('markup', () => {
    return gulp.src(config.src.markup)
    .pipe(gulp.dest(config.dest.markup));
});

// Remove all distribution files
gulp.task('clean', (done) => {
    del.sync([config.dest.dist]);
    done();
});

// Manages changes for a single file instead of a directory
const watcher = (e) => {
    let src      = path.relative(path.resolve(__dirname), e.path);
    let fpath    = `${config.dest.dist}/${path.relative(path.resolve(config.src.app), e.path)}`;
    let dest     = path.normalize(path.dirname(fpath));
    let ext      = path.extname(src);

    if (fs.existsSync(fpath)) {
        del.sync([fpath]);
    }

    if (e.event !== 'unlink') {
        gulp.src(src).pipe(gulp.dest(dest));
    }

    console.log(`${timestamp()} File ${e.event}: ${src} -> ${fpath}`);
};

gulp.task('watching', (done) => {
    gulp.watch(config.watch.style, ['styles']);
    gulpwatch(config.watch.markup, watcher);
    gulpwatch(config.watch.assets, watcher);
    const scriptWatcher = gulp.watch(config.watch.js, () => { runSequence(['manifest']); });

    done();
});

// Server locally
gulp.task('serve', (done) => {
    // Delay to allow server time to start
    setTimeout(() => {
        browserSync({
            notify: false,
            timestamps: true,
            logPrefix: '00:00:00',
            port: config.port.browsersync,
            ui: {port: config.port.browsersync + 1},
            proxy: `localhost:${config.port.proxy}`
        });

        done();
    }, 5000);
});

// Build
gulp.task('build', (done) => {
    runSequence(
        ['clean'],
        ['scripts', 'assets', 'assets:toolkit', 'styles'],
        ['markup'],
        done
    );
});

// The default task
gulp.task('default', (done) => {
    if (env === 'development') {
        runSequence(
            ['build'],
            ['watching'],
        () => {
            gulp.start('serve');
            done();
        });
    } else {
        runSequence(['build'], () => {
            done();
        });
    }
});
