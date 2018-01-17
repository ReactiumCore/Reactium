'use strict';

/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
const assembler      = require('butter-assemble');
//const beautify       = require('js-beautify').js_beautify;
const browsersync    = require('browser-sync');
const concat         = require('gulp-concat');
const csso           = require('gulp-csso');
const del            = require('del');
const fs             = require('fs-extra');
const gulp           = require('gulp');
const gulpif         = require('gulp-if');
const gutil          = require('gulp-util');
const path           = require('path');
const prefix         = require('gulp-autoprefixer');
const reload         = browsersync.reload;
const rename         = require('gulp-rename');
const runSequence    = require('run-sequence');
const sass           = require('gulp-sass');
const sassLint       = require('gulp-sass-lint');
const slugify        = require('slugify');
const source         = require('vinyl-source-stream');
const sourcemaps     = require('gulp-sourcemaps');
const webpack        = require('webpack');
const nodemon        = require('nodemon');
//const log            = console.log.bind(console);
const yargs          = require('yargs').argv;
const zip            = require('zip-folder');
const eslint         = require('gulp-eslint');

/**
 * configuration
 */

const config    = require(__dirname + '/gulp.config.json');
config.dev      = yargs.dev;

config.scripts.helpers = {
    "cond"      : require('handlebars-cond').cond,
    "lipsum"    : require('handlebars-lipsum'),
    "loop"      : require('handlebars-loop')
};

if (yargs.hasOwnProperty('port')) {
    config.port.browsersync    = Number(yargs.port);
    config.port.proxy          = Number(yargs.port) + 30;
}

config.hooks = {
    beforeMaterials: (options, data) => {
        let libs = libScan('materials');
        return data.files.concat(libs);
    },
    beforeViews: (options, data) => {
        let libs = libScan('views');
        return data.files.concat(libs);
    }
};

// libScan
const libScan = (action) => {
    if (!action) { return []; }
    if (!action) { return []; }

    let libs      = [];
    let output    = [];
    let lpath     = config.src + '/lib/';
    action        = String(action).toLowerCase();

    fs.readdirSync(lpath).forEach((result) => {
        if (result.substr(0, 1) === '.') { return; }
        if (result.substr(0, 2) === '__') { return; }

        let dpath = lpath + result;
        if (!fs.lstatSync(dpath).isDirectory()) { return; }
        libs.push(dpath);
    });

    libs.forEach((lpath) => {

        switch (action) {
            case 'vendor':
                try {
                    fs.readdirSync(lpath + '/assets/scripts').forEach((file) => {
                        if (String(file).toLowerCase().substr(file.length - 7) === '.min.js') {
                            output.push(lpath+ '/assets/scripts/' + file);
                        }
                    });
                } catch (err) { }

                break;

            case 'materials':
            case 'views':
                try {
                    let mpath = lpath + '/' + action;
                    fs.readdirSync(mpath).forEach((result) => {
                        let fpath = mpath + '/' + result;
                        if (fs.lstatSync(fpath).isDirectory()) {
                            fs.readdirSync(fpath).forEach((file) => {
                                output.push(fpath + '/' + file);
                            });
                        } else {
                            output.push(mpath + '/' + result);
                        }
                    });
                } catch (err) { }

                break;
        }
    });

    return output;
};

// Webpack
const webpackConfig = require(__dirname + '/webpack.config')(config);


// clean
gulp.task('clean', del.bind(null, [config.dest]));

// styles
gulp.task('styles:ar', () => {
	return gulp.src(config.styles.ar.src)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(prefix('last 1 version'))
		.pipe(gulpif(!config.dev, csso()))
		.pipe(rename('ar.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.styles.ar.dest))
		.pipe(gulpif(config.dev, reload({stream: true})));
});

gulp.task('styles:toolkit', () => {
	return gulp.src(config.styles.toolkit.src)
		.pipe(gulpif(config.dev, sourcemaps.init()))
		.pipe(sass({
			includePaths: ['./node_modules'],
		}).on('error', sass.logError))
		.pipe(prefix('last 1 version'))
		.pipe(gulpif(!config.dev, csso()))
		.pipe(gulpif(config.dev, sourcemaps.write()))
		.pipe(gulp.dest(config.styles.toolkit.dest))
		.pipe(gulpif(config.dev, reload({stream: true})));
});

gulp.task('styles:lint', [], function () {
    return gulp.src(config.styles.toolkit.src)
        .pipe(sassLint({
            configFile: './sass-lint-config.yml'
        }))
        .pipe(sassLint.format());
});

gulp.task('styles', ['styles:ar', 'styles:toolkit', 'styles:lint']);

// scripts
gulp.task('scripts', (done) => {
	webpack(webpackConfig, (err, stats) => {
		if (err) {
			gutil.log(gutil.colors.red(err()));
		}
		const result = stats.toJson();
		if (result.errors.length) {
			result.errors.forEach((error) => {
				gutil.log(gutil.colors.red(error));
			});
		}
		done();
	});
});

gulp.task('scripts:lint', function () {
    return gulp.src(config.scripts.toolkit.src)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// images
gulp.task('images:ar', ['favicon'], () => {
	return gulp.src(config.images.ar.src)
		.pipe(gulp.dest(config.images.ar.dest));
});

gulp.task('images:toolkit', ['favicon'], () => {
	return gulp.src(config.images.toolkit.src)
		.pipe(gulp.dest(config.images.toolkit.dest));
});

gulp.task('images', ['images:ar', 'images:toolkit']);

gulp.task('favicon', () => {
	return gulp.src('src/favicon.ico')
		.pipe(gulp.dest(config.dest));
});


/**
 * ------------------------------------------------------------------------
 * CUSTOM TASKS
 * ------------------------------------------------------------------------
 */
/**
 * @name vendor
 * @description CAM: Added the vendor task which concats all the vendor .js
 * files into a single file. This is useful when you need to include a minified
 * .js file (typically name like: myscript.min.js).
 */
gulp.task('vendor', (done) => {
    if (config.scripts.hasOwnProperty('vendor')) {

        let files = (typeof config.scripts.vendor.watch === 'string') ? [config.scripts.vendor.watch] : config.scripts.vendor.watch;

        // Add lib vendor scripts
        libScan('vendor').forEach((file) => { files.push(file); });

        return gulp.src(files)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(config.scripts.vendor.dest));

    } else {
        done();
    }
});

gulp.task('polyfill', (done) => {
    if (config.scripts.hasOwnProperty('polyfill')) {

        let files = (typeof config.scripts.polyfill.watch === 'string') ? [config.scripts.polyfill.watch] : config.scripts.polyfill.watch;

        return gulp.src(files)
        .pipe(concat('polyfill.js'))
        .pipe(gulp.dest(config.scripts.polyfill.dest));

    } else {
        done();
    }
});

/**
 * @name font
 * @description CAM: Added the font task which copies the fonts directory to the
 * config.dest directory
 */
gulp.task('fonts:butter', () => {
    return gulp.src(config.fonts.butter.src)
    .pipe(gulp.dest(config.fonts.butter.dest));
});
gulp.task('fonts', ['fonts:butter'], () => {
	return gulp.src(config.fonts.src)
    .pipe(gulp.dest(config.fonts.dest));
});


// assembler
gulp.task('assembler', (done) => {
	assembler({
        logErrors    : config.dev,
        dest         : config.dest,
        hooks        : config.hooks,
        helpers      : config.scripts.helpers
	});
	done();
});

// nodemon -> start server and reload on change
gulp.task('nodemon', (done) => {
    if (!config.dev) { done(); return; }

    let callbackCalled = false;
    nodemon({
        watch : config.dest,
        env: {
            port: config.port.proxy
        },
        script: __dirname + '/index.js',
        ext: 'js ejs json jsx html css scss'
    }).on('start', function () {
        if (!callbackCalled) {
            callbackCalled = true;
            done();
        }
    }).on('quit', () => {
        process.exit();
    }).on('restart', function () {
        reload();
    });
});

// server
gulp.task('serve', () => {

	gulp.task('styles:watch', ['styles']);
	gulp.watch([config.styles.ar.watch, config.styles.toolkit.watch], ['styles:watch']);

    gulp.task('scripts:watch', ['scripts','scripts:lint']);
    gulp.watch([config.scripts.ar.watch, config.scripts.toolkit.watch, config.scripts.catalyst.watch], ['scripts:watch']);
    gulp.watch('config.scripts.toolkit.watch', ['scripts:lint']);

	gulp.task('images:watch', ['images'], reload);
	gulp.watch([config.images.ar.watch, config.images.toolkit.watch], ['images:watch']);

	gulp.task('assembler:watch', ['assembler']);
	gulp.watch(config.templates.watch, ['assembler:watch']);

	gulp.task('vendor:watch', ['vendor']);
	gulp.watch(config.scripts.vendor.watch, ['vendor:watch']);

    gulp.task('polyfill:watch', ['polyfill']);
    gulp.watch(config.scripts.polyfill.watch, ['polyfill:watch']);

	gulp.task('fonts:watch', ['fonts']);
	gulp.watch(config.fonts.watch, ['fonts:watch']);

    browsersync({
        notify            : false,
        timestamps        : true,
        reloadDelay       : 1000,
        reloadDebounce    : 2000,
        logPrefix         : '00:00:00',
        port              : config.port.browsersync,
        ui                : {port: config.port.browsersync+1},
        proxy             : 'localhost:'+config.port.proxy
    });

});

// default build task
gulp.task('default', (done) => {
	// run build
    if (config.dev) {
        runSequence(['clean'], ['assembler'], config.tasks, ['nodemon'], () => {
            gulp.start('serve');
            done();
        });
    } else {
        runSequence(['clean'], ['assembler'], config.tasks, () => {
            done();
        });
    }
});

gulp.task('zip-dist', (done) => {
    zip(config.dest, config.zip, function(err) {
        if(err) {
            console.log('oh no!', err);
        } else {
            console.log('zipped dist folder');
        }
        done();
    });
});
