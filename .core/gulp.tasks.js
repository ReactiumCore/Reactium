'use strict';

const del = require('del');
const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');
const webpack = require('webpack');
const browserSync = require('browser-sync');
const gulpif = require('gulp-if');
const gulpwatch = require('gulp-watch');
const run = require('gulp-run');
const prefix = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const jsonFunctions = require('node-sass-functions-json').default;
const tildeImporter = require('node-sass-tilde-importer');
const less = require('gulp-less');
const csso = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const chalk = require('chalk');
const moment = require('moment');
const reactiumConfig = require('./reactium-config');
const regenManifest = require('./manifest/manifest-tools');
const libraryTools = require('./manifest/library-tools');
const rootPath = path.resolve(__dirname, '..');
const { fork } = require('child_process');

// For backward compatibility with gulp override tasks using run-sequence module
// make compatible with gulp4
require('module-alias').addAlias('run-sequence', 'gulp4-run-sequence');

const reactium = (gulp, config, webpackConfig) => {
    const task = require('./get-task')(gulp);

    const env = process.env.NODE_ENV || 'development';
    const assetPath = p => {
        p.dirname = p.dirname.split('assets').pop();
    };
    const markupPath = p => {
        if (p.extname === '.css') {
            p.dirname = config.dest.style.split(config.dest.markup).pop();
        }
    };

    // Update config from environment variables
    config.port.browsersync = process.env.hasOwnProperty('APP_PORT')
        ? Number(process.env.APP_PORT)
        : Number(config.port.browsersync);

    const noop = done => done();

    const timestamp = () => {
        let now = moment().format('HH:mm:ss');
        return `[${chalk.blue(now)}]`;
    };

    const watcher = e => {
        let src = path.relative(path.resolve(__dirname), e.path);
        let ePathRelative = path.relative(path.resolve(config.src.app), e.path);
        let fpath = path.resolve(
            rootPath,
            `${config.dest.dist}/${ePathRelative.replace(
                /^.*?\/assets/,
                'assets',
            )}`,
        );

        let displaySrc = path.relative(rootPath, e.path);
        let displayDest = path.relative(rootPath, fpath);

        if (fs.existsSync(fpath)) {
            del.sync([fpath]);
        }

        if (e.event !== 'unlink') {
            const destPath = path.dirname(fpath);
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }

            fs.createReadStream(e.path)
                .pipe(fs.createWriteStream(fpath))
                .on('error', error => console.error(timestamp(), error));
        }

        console.log(
            `${timestamp()} File ${e.event}: ${displaySrc} -> ${displayDest}`,
        );
    };

    const serve = ({ open } = { open: config.open }) => done => {
        // Serve locally
        // Delay to allow server time to start

        setTimeout(() => {
            browserSync({
                notify: false,
                timestamps: true,
                logPrefix: '00:00:00',
                port: config.port.browsersync,
                ui: { port: config.port.browsersync + 1 },
                proxy: `localhost:${config.port.proxy}`,
                open: open,
                ghostMode: false,
            });

            done();
        }, 5000);
    };

    const watch = (done, restart = false) => {
        let watchProcess = fork(path.resolve(__dirname, './gulp.watch.js'), {
            env: process.env,
            stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
        });
        watchProcess.send({ config, webpackConfig, restart });
        watchProcess.on('message', message => {
            switch (message) {
                case 'build-started': {
                    console.log("[00:00:00] Starting 'build'...");
                    done();
                    return;
                }
                case 'restart-watches': {
                    console.log("[00:00:00] Restarting 'watch'...");
                    watchProcess.kill();
                    watch(_ => _, true);
                    return;
                }
            }
        });
    };

    const local = ({ ssr = false } = {}) => () => {
        const SSR_MODE = ssr ? 'on' : 'off';

        let watch = new run.Command(
            `cross-env SSR_MODE=${SSR_MODE} NODE_ENV=development gulp`,
            { verbosity: 3 },
        );
        let babel = new run.Command(
            `cross-env SSR_MODE=${SSR_MODE} NODE_ENV=development nodemon ./.core/index.js --exec babel-node`,
            { verbosity: 3 },
        );

        watch.exec();
        babel.exec();
    };

    const assets = () =>
        gulp
            .src(config.src.assets)
            .pipe(rename(assetPath))
            .pipe(gulp.dest(config.dest.assets));

    const build = gulp.series(
        task('preBuild'),
        task('clean'),
        task('manifest'),
        gulp.parallel(task('scripts'), task('assets'), task('styles')),
        gulp.parallel(task('markup'), task('json')),
        task('postBuild'),
    );

    const clean = done => {
        // Remove build files
        del.sync([config.dest.dist]);
        done();
    };

    const defaultTask = env === 'development' ? task('watch') : task('build');

    const json = () =>
        gulp.src(config.src.json).pipe(gulp.dest(config.dest.build));

    const manifest = done => {
        // Generate manifest.js file
        regenManifest({
            manifestFilePath: config.src.manifest,
            manifestConfig: require('./manifest.config')(
                reactiumConfig.manifest,
            ),
            manifestTemplateFilePath: path.resolve(
                __dirname,
                'manifest/templates/manifest.hbs',
            ),
            manifestProcessor: require('./manifest/processors/manifest'),
        });
        done();
    };

    const markup = () =>
        gulp
            .src(config.src.markup)
            .pipe(rename(markupPath))
            .pipe(gulp.dest(config.dest.markup));

    const scripts = done => {
        // Compile js
        let isDev = env === 'development';

        if (!isDev) {
            webpack(webpackConfig, (err, stats) => {
                if (err) {
                    console.log(err());
                    done();
                    return;
                }

                let result = stats.toJson();

                if (result.errors.length > 0) {
                    result.errors.forEach(error => {
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
    };

    const library = gulp.series(
        task('library:manifest'),
        task('library:copy'),
        task('library:dependencies'),
    );

    const libraryManifest = done => {
        // Generate manifest.js file
        regenManifest({
            manifestFilePath: config.src.library,
            manifestConfig: require('./manifest.config')(
                reactiumConfig.library,
            ),
            manifestTemplateFilePath: path.resolve(
                __dirname,
                'manifest/templates/library.hbs',
            ),
            manifestProcessor: require('./manifest/processors/library'),
        });
        done();
    };

    const libraryCopy = done => {
        let babel = new run.Command(
            `cross-env NODE_ENV=production babel src --out-dir ${
                config.dest.library
            }`,
            { verbosity: 3 },
        );

        babel.exec();

        // Copy static files
        [config.src.style, config.src.assets].forEach(src =>
            gulp.src(src).pipe(gulp.dest(config.dest.library)),
        );

        done();
    };

    const libraryDependencies = done => {
        libraryTools.createPackage();
        done();
    };

    const staticTask = task('static:copy');

    const staticCopy = done => {
        // Copy static files
        fs.copySync(config.dest.dist, config.dest.static);

        let mainPage = path.normalize(
            `${config.dest.static}/index-static.html`,
        );

        if (fs.existsSync(mainPage)) {
            let newName = mainPage
                .split('index-static.html')
                .join('index.html');
            fs.renameSync(mainPage, newName);
        }

        done();
    };

    const stylesColors = done => {
        if (config.cssPreProcessor === 'sass') {
            // Currently only works with sass
            let colorProfiles = globby.sync(config.src.colors);
            if (colorProfiles.length > 0) {
                let colorFileContents =
                    '// WARNING: Do not directly edit this file !!!!\n// File generated by gulp styles:colors task\n\n';
                let colorVars = [];
                let colorArr = [];

                colorProfiles.forEach(filePath => {
                    let profile = fs.readFileSync(path.resolve(filePath));
                    profile = JSON.parse(profile);

                    Object.keys(profile).forEach(k => {
                        let code = profile[k];
                        let cvar = `$${k}`;
                        let vline = `${cvar}: ${code};`;
                        let cname = k.split('color-').join('');
                        let aline = `\t"${cname}": ${cvar}`;

                        colorVars.push(vline);
                        colorArr.push(aline);
                    });
                });

                colorFileContents += colorVars.join('\n') + '\n\n\n';
                colorFileContents += `$color: (\n${colorArr.join(
                    ',\n',
                )}\n);\n\n\n`;
                colorFileContents +=
                    '@each $clr-name, $clr-code in $color {\n\t.#{$clr-name} { color: $clr-code; }\n\t.bg-#{$clr-name} { background-color: $clr-code; }\n}';

                fs.ensureFileSync(config.dest.colors);
                fs.writeFileSync(config.dest.colors, colorFileContents, 'utf8');
            }
        }

        done();
    };

    const stylesCompile = () => {
        // Compile Sass & Less
        let isDev = env === 'development';
        let isSass = config.cssPreProcessor === 'sass';
        let isLess = config.cssPreProcessor === 'less';

        return gulp
            .src(config.src.style)
            .pipe(gulpif(isDev, sourcemaps.init()))
            .pipe(
                gulpif(
                    isSass,
                    sass({
                        functions: {
                            ...jsonFunctions,
                        },
                        importer: tildeImporter,
                        includePaths: config.src.includes,
                    }).on('error', sass.logError),
                ),
            )
            .pipe(gulpif(isLess, less({ paths: config.src.includes })))
            .pipe(prefix(config.browsers))
            .pipe(gulpif(!isDev, csso()))
            .pipe(gulpif(isDev, sourcemaps.write()))
            .pipe(rename({ dirname: '' }))
            .pipe(gulp.dest(config.dest.style))
            .pipe(gulpif(isDev, browserSync.stream()));
    };

    const styles = gulp.series(task('styles:colors'), task('styles:compile'));

    const watchFork = done => {
        // Watch for file changes
        gulp.watch(config.watch.colors, gulp.task('styles:colors'));
        gulp.watch(config.watch.style, gulp.task('styles:compile'));
        gulpwatch(config.watch.markup, watcher);
        gulpwatch(config.watch.assets, watcher);
        const scriptWatcher = gulp.watch(
            config.watch.js,
            gulp.task('manifest'),
        );
        done();
    };

    const tasks = {
        local: local(),
        'local:ssr': local({ ssr: true }),
        assets,
        preBuild: noop,
        build,
        postBuild: noop,
        postServe: noop,
        clean,
        default: defaultTask,
        json,
        manifest,
        markup,
        scripts,
        serve: serve(),
        'serve-restart': serve({ open: false }),
        library,
        'library:manifest': libraryManifest,
        'library:copy': libraryCopy,
        'library:dependencies': libraryDependencies,
        static: staticTask,
        'static:copy': staticCopy,
        'styles:colors': stylesColors,
        'styles:compile': stylesCompile,
        styles,
        watch,
        watchFork,
    };

    let tasksOverride = _ => _;
    if (fs.existsSync(`${rootPath}/gulp.tasks.override.js`)) {
        tasksOverride = require(`${rootPath}/gulp.tasks.override.js`);
    }

    return tasksOverride(tasks, config);
};

module.exports = reactium;
