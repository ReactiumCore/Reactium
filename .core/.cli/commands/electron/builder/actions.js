const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const moment = require('moment');
const op = require('object-path');
const { spawn } = require('child_process');
const prettier = require('prettier').format;
const handlebars = require('handlebars').compile;

const timestamp = () => `[${chalk.magenta(moment().format('HH:mm:ss'))}]`;

const msg = (...msg) => console.log(timestamp(), ...msg);
const override = `
module.${chalk.cyan('exports')} = ${chalk.magenta('config')} => {
    config.${chalk.cyan('dest')}.${chalk.cyan('electron')} = ${chalk.magenta(
    "'build-electron'",
)};
    config.${chalk.cyan('dest')}.${chalk.cyan('static')} = ${chalk.magenta(
    "'build-electron/app/public'",
)};
    config.${chalk.cyan('electron')} = {
        ${chalk.cyan('config')}: {
            ${chalk.cyan('width')}: ${chalk.white(1024)},
            ${chalk.cyan('height')}: ${chalk.white(768)},
            ${chalk.cyan('show')}: ${chalk.white('false')},
            ${chalk.cyan('title')}: ${chalk.magenta("'App Title'")},
            ${chalk.cyan('backgroundColor')}: ${chalk.magenta("'#000000'")},
        },
        ${chalk.cyan('devtools')}: ${chalk.white('true')},
    };
    config.${chalk.cyan('open')} = ${chalk.white('false')};

    return ${chalk.magenta('config')};
};
`;

let cwd;
let gulpConfig;
let reactiumConfig;

module.exports = () => {
    return {
        setup: ({ action, props }) =>
            new Promise(resolve => {
                cwd = op.get(props, 'cwd');
                reactiumConfig = require(path.join(
                    cwd,
                    '.core',
                    'reactium-config.js',
                ));
                gulpConfig = reactiumConfig.build;

                if (!op.has(gulpConfig, 'dest.electron')) {
                    console.log('\n');
                    msg(
                        `The following ${chalk.cyan(
                            'gulp.config.override.js',
                        )} values need to be added:`,
                    );
                    console.log('\n');
                    console.log(override);
                    console.log('\n');
                    process.exit(0);
                }

                resolve({ action, status: 200 });
            }),
        config: ({ action, props }) =>
            new Promise(resolve => {
                const configFile = path.join(
                    cwd,
                    gulpConfig.dest.electron,
                    'app.config.js',
                );

                if (!fs.existsSync(configFile)) {
                    msg('Generating', chalk.cyan('app.config.js') + '...');

                    const appConfig = {
                        port: op.get(gulpConfig, 'port'),
                        electron: op.get(gulpConfig, 'electron'),
                    };

                    fs.ensureFileSync(configFile);

                    const templateFile = path.join(
                        __dirname,
                        'template',
                        'app.config.hbs',
                    );

                    const template = handlebars(
                        fs.readFileSync(templateFile, 'utf-8'),
                    )({
                        config: String(
                            prettier(JSON.stringify(appConfig, null, 4), {
                                parser: 'json5',
                            }),
                        ).trim(),
                    });

                    fs.writeFileSync(configFile, template);
                }

                resolve({ action, status: 200 });
            }),

        build: ({ action, props }) =>
            new Promise(resolve => {
                const exec = spawn('gulp', ['--color'], {
                    env: {
                        ...process.env,
                        cwd,
                        NODE_ENV: 'production',
                    },
                });

                exec.on('exit', () => resolve({ action, status: 200 }));
                exec.stderr.pipe(process.stderr);
                exec.stdout.pipe(process.stdout);
            }),

        babelConfig: ({ action, props }) =>
            new Promise(resolve => {
                msg('Generating', chalk.cyan('babel.config.js') + '...');

                const babelBuildFile = path.join(
                    cwd,
                    op.get(reactiumConfig, 'dest.electron', 'build-electron'),
                    'babel.config.js',
                );
                const babelConfigFile = path.join(cwd, 'babel.config.js');

                fs.ensureFileSync(babelBuildFile);
                fs.copySync(babelConfigFile, babelBuildFile);

                resolve({ action, status: 200 });
            }),

        babelConfigUpdate: ({ action, props }) =>
            new Promise(resolve => {
                msg('Updating', chalk.cyan('babel.config.js paths') + '...');
                const babelBuildFile = path.normalize(
                    path.join(
                        cwd,
                        op.get(
                            reactiumConfig,
                            'dest.electron',
                            'build-electron',
                        ),
                        'babel.config.js',
                    ),
                );
                const cont = String(
                    fs.readFileSync(babelBuildFile, 'utf-8'),
                ).replace(/\'\.\/\.core/gi, "'../.core");

                fs.writeFileSync(babelBuildFile, cont);

                resolve({ action, status: 200 });
            }),

        compileCore: ({ action, props }) =>
            new Promise(resolve => {
                msg('Compiling', chalk.cyan('.core') + '...');
                const outDir = path.join(
                    cwd,
                    op.get(gulpConfig, 'dest.build', 'build/.core'),
                );
                const srcDir = path.join(cwd, '.core');

                const exec = spawn(
                    'babel',
                    [srcDir, '--out-dir', outDir, '--color'],
                    {
                        env: {
                            ...process.env,
                            cwd,
                            NODE_ENV: 'production',
                        },
                    },
                );

                exec.on('exit', () => resolve({ action, status: 200 }));
                //exec.stderr.pipe(process.stderr);
                exec.stdout.pipe(process.stdout);
            }),

        compileSrc: ({ action, props }) =>
            new Promise(resolve => {
                msg('Compiling', chalk.cyan('src') + '...');
                const outDir = path.join(
                    cwd,
                    op.get(gulpConfig, 'dest.buildSrc', 'build/src'),
                );
                const srcDir = path.join(cwd, 'src');

                const exec = spawn(
                    'babel',
                    [srcDir, '--out-dir', outDir, '--color'],
                    {
                        env: {
                            ...process.env,
                            cwd,
                            NODE_ENV: 'production',
                        },
                    },
                );

                exec.on('exit', () => resolve({ action, status: 200 }));
                //exec.stderr.pipe(process.stderr);
                exec.stdout.pipe(process.stdout);
            }),
        static: ({ action, props }) =>
            new Promise(resolve => {
                msg('Copying', chalk.cyan('static assets') + '...');
                const exec = spawn('gulp', ['static', '--color'], {
                    env: {
                        ...process.env,
                        cwd,
                        NODE_ENV: 'production',
                    },
                });

                exec.on('exit', () => resolve({ action, status: 200 }));
                exec.stderr.pipe(process.stderr);
                exec.stdout.pipe(process.stdout);
            }),

        main: ({ action, props }) =>
            new Promise(resolve => {
                const destFile = path.join(
                    cwd,
                    gulpConfig.dest.electron,
                    'main.js',
                );

                if (!fs.existsSync(destFile)) {
                    msg('Generating', chalk.cyan('main.js') + '...');

                    const templateFile = path.join(
                        __dirname,
                        'template',
                        'main.js',
                    );

                    fs.ensureFileSync(destFile);
                    fs.copySync(templateFile, destFile);
                }

                resolve({ action, status: 200 });
            }),

        resources: ({ action, props }) =>
            new Promise(resolve => {
                const destDir = path.join(
                    cwd,
                    gulpConfig.dest.electron,
                    'resources',
                );

                if (!fs.existsSync(destDir)) {
                    const templateDir = path.join(
                        __dirname,
                        'template',
                        'resources',
                    );

                    fs.ensureDirSync(destDir);
                    fs.copySync(templateDir, destdir);
                }

                resolve({ action, status: 200 });
            }),

        package: ({ action, props }) =>
            new Promise(resolve => {
                const destFile = path.join(
                    cwd,
                    gulpConfig.dest.electron,
                    'package.json',
                );

                if (!fs.existsSync(destFile)) {
                    const templateFile = path.join(
                        __dirname,
                        'template',
                        'package.json',
                    );

                    fs.ensureFileSync(destFile);
                    fs.copySync(templateFile, destFile);
                }

                resolve({ action, status: 200 });
            }),

        complete: ({ action }) => {
            console.log('');
            msg('Build', chalk.cyan('Complete') + '!');
            console.log('');
            return Promise.resolve({ action, status: 200 });
        },
    };
};
