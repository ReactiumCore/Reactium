'use strict';

const del = require('del');
const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');
const webpack = require('webpack');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const gulpif = require('gulp-if');
const gulpwatch = require('gulp-watch');
const run = require('gulp-run');
const prefix = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const tildeImporter = require('node-sass-tilde-importer');
const less = require('gulp-less');
const csso = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const chalk = require('chalk');
const moment = require('moment');
const regenManifest = require('./manifest-tools');
const rootPath = path.resolve(__dirname, '..');
const { fork } = require('child_process');

const reactium = (gulp, config, webpackConfig) => {
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

    const serve = (done, open = config.open) => {
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

    const tasks = {
        local: () => {
            let watch = new run.Command(
                'cross-env SSR_MODE=off NODE_ENV=development gulp',
                { verbosity: 3 },
            );
            let babel = new run.Command(
                'cross-env SSR_MODE=off NODE_ENV=development nodemon ./.core/index.js --exec babel-node',
                { verbosity: 3 },
            );

            watch.exec();
            babel.exec();
        },
        'local:ssr': () => {
            let watch = new run.Command(
                'cross-env SSR_MODE=on NODE_ENV=development gulp',
                { verbosity: 3 },
            );
            let babel = new run.Command(
                'cross-env SSR_MODE=on NODE_ENV=development nodemon ./.core/index.js --exec babel-node',
                { verbosity: 3 },
            );

            watch.exec();
            babel.exec();
        },
        assets: () => {
            // Copy assets dir
            return gulp
                .src(config.src.assets)
                .pipe(rename(assetPath))
                .pipe(gulp.dest(config.dest.assets));
        },
        // stub task to provide sequenced override for application
        preBuild: done => done(),
        build: done => {
            // Build
            runSequence(
                ['preBuild'],
                ['clean'],
                ['manifest'],
                ['scripts', 'assets', 'styles'],
                ['markup', 'json'],
                ['postBuild'],
                done,
            );
        },
        // stub task to provide sequenced override for application
        postBuild: done => done(),
        postServe: done => done(),
        clean: done => {
            // Remove build files
            del.sync([config.dest.dist]);
            done();
        },
        default: done => {
            // Default gulp command
            if (env === 'development') {
                runSequence(['watch'], () => {
                    done();
                });
            } else {
                runSequence(['build'], () => {
                    done();
                });
            }
        },
        json: () => {
            return gulp.src(config.src.json).pipe(gulp.dest(config.dest.build));
        },
        manifest: done => {
            // Generate manifest.js file
            regenManifest();
            done();
        },
        markup: () => {
            // Copy markup
            return gulp
                .src(config.src.markup)
                .pipe(rename(markupPath))
                .pipe(gulp.dest(config.dest.markup));
        },
        scripts: done => {
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
        },
        serve: done => {
            serve(done);
        },
        'serve-restart': done => {
            serve(done, false);
        },
        static: done => {
            // Build static site
            runSequence(['static:copy'], done);
        },
        'static:copy': done => {
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
        },
        'styles:colors': done => {
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
                    fs.writeFileSync(
                        config.dest.colors,
                        colorFileContents,
                        'utf8',
                    );
                }
            }

            done();
        },
        'styles:compile': () => {
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
        },
        styles: done => {
            runSequence(['styles:colors'], ['styles:compile'], done);
        },
        watch,
        watchFork: done => {
            // Watch for file changes
            gulp.watch(config.watch.colors, ['styles']);
            gulp.watch(config.watch.style, ['styles']);
            gulpwatch(config.watch.markup, watcher);
            gulpwatch(config.watch.assets, watcher);
            const scriptWatcher = gulp.watch(config.watch.js, () => {
                runSequence(['manifest']);
            });

            done();
        },
    };

    let tasksOverride = _ => _;
    if (fs.existsSync(`${rootPath}/gulp.tasks.override.js`)) {
        tasksOverride = require(`${rootPath}/gulp.tasks.override.js`);
    }

    return tasksOverride(tasks, config);
};

module.exports = reactium;
