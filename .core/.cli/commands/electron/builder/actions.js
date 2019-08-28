const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const run = require('gulp-run');
const moment = require('moment');
const op = require('object-path');
const prettier = require('prettier').format;
const handlebars = require('handlebars').compile;

const timestamp = () => `[${chalk.magenta(moment().format('HH:mm:ss'))}]`;
const msg = (...msg) => console.log(timestamp(), ...msg);

const gulpOverride = `
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

/*
const manifestOverride = `
module.${chalk.cyan('exports')} = ${chalk.magenta('config')} => {
    config.${chalk.cyan('contexts.components.mode')} = ${chalk.magenta(
    "'sync'",
)};
    config.${chalk.cyan('contexts.common.mode')} = ${chalk.magenta("'sync'")};
    config.${chalk.cyan('contexts.toolkit.mode')} = ${chalk.magenta("'sync'")};
    config.${chalk.cyan('contexts.core.mode')} = ${chalk.magenta("'sync'")};

    return ${chalk.magenta('config')};
};
`;
*/

let cwd;
let gulpConfig;
let manifestConfig;
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
                manifestConfig = reactiumConfig.manifest;

                if (!op.has(gulpConfig, 'dest.electron')) {
                    msg(
                        `The following ${chalk.cyan(
                            'gulp.config.override.js',
                        )} values need to be set:`,
                    );
                    console.log('\n');
                    console.log(gulpOverride);
                    console.log(`${chalk.magenta('Action cancelled')}!`);
                    console.log('\n');

                    process.exit(0);
                }

                /*
                if (
                    op.get(manifestConfig, 'contexts.components.mode') !==
                    'sync'
                ) {
                    msg(
                        `The following ${chalk.cyan(
                            'manifest.config.override.js',
                        )} values need to be set:`,
                    );
                    console.log('\n');
                    console.log(manifestOverride);
                    console.log(`${chalk.magenta('Action cancelled')}!`);
                    console.log('\n');

                    process.exit(0);
                }
                */

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
                msg('Building', chalk.cyan('app') + '...');
                const cmd = new run.Command(
                    `cross-env NODE_ENV=production gulp --color`,
                    { verbosity: 0 },
                );
                setTimeout(
                    () =>
                        cmd.exec(null, () => resolve({ action, status: 200 })),
                    1,
                );
            }),

        compileCore: ({ action, props }) =>
            new Promise(resolve => {
                msg('Compiling', chalk.cyan('core') + '...');
                const srcDir = path.join(cwd, '.core');
                const outDir = path.join(
                    cwd,
                    op.get(gulpConfig, 'dest.build', 'build/.core'),
                );
                const cmd = new run.Command(
                    `cross-env NODE_ENV=production babel "${srcDir}" --out-dir "${outDir}"`,
                    { verbosity: 0 },
                );
                setTimeout(
                    () =>
                        cmd.exec(null, () => resolve({ action, status: 200 })),
                    1,
                );
            }),

        compileSrc: ({ action, props }) =>
            new Promise(resolve => {
                msg('Compiling', chalk.cyan('src') + '...');
                const srcDir = path.join(cwd, 'src');
                const outDir = path.join(
                    cwd,
                    op.get(gulpConfig, 'dest.buildSrc', 'build/src'),
                );
                const cmd = new run.Command(
                    `cross-env NODE_ENV=production babel "${srcDir}" --out-dir "${outDir}"`,
                    { verbosity: 0 },
                );
                setTimeout(
                    () =>
                        cmd.exec(null, () => resolve({ action, status: 200 })),
                    1,
                );
            }),

        static: ({ action, props }) =>
            new Promise(resolve => {
                // Clear output directory
                fs.removeSync(
                    path.join(
                        cwd,
                        op.get(
                            gulpConfig,
                            'dest.static',
                            'build-electron/app/public',
                        ),
                    ),
                );

                const cmd = new run.Command(`gulp static --color`, {
                    verbosity: 0,
                });
                setTimeout(
                    () =>
                        cmd.exec(null, () => resolve({ action, status: 200 })),
                    1,
                );
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
                    msg(`Copying ${chalk.cyan('resources')}...`);
                    const templateDir = path.join(
                        __dirname,
                        'template',
                        'resources',
                    );

                    fs.ensureDirSync(destDir);
                    fs.copySync(templateDir, destDir);
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
                    msg(`Generating ${chalk.cyan('package.json')}...`);

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

        icon: ({ action, props }) =>
            new Promise(resolve => {
                msg(`Generating ${chalk.cyan('icons')}...`);

                const shFile = path.join(
                    cwd,
                    gulpConfig.dest.electron,
                    'resources',
                    'icon_gen.sh',
                );

                const icon = path.join(
                    cwd,
                    gulpConfig.dest.electron,
                    'resources',
                    'icon.png',
                );

                const output = path.join(
                    cwd,
                    gulpConfig.dest.electron,
                    'resources',
                );

                const cmd = new run.Command(
                    `sh "${shFile}" "${icon}" "${output}"`,
                    { verbosity: 0 },
                );
                cmd.exec(null, () => resolve({ action, status: 200 }));
            }),

        installElectron: ({ action, props }) =>
            new Promise(resolve => {
                msg(`Installing ${chalk.cyan('Electron')}...`);
                let cmd = new run.Command(`npm install --save-dev electron`, {
                    verbosity: 0,
                });

                setTimeout(
                    () =>
                        cmd.exec(null, () => resolve({ action, status: 200 })),
                    1,
                );
            }),

        install: ({ action, props }) =>
            new Promise(resolve => {
                msg(`Installing ${chalk.cyan('dependencies')}...`);
                let cmd = new run.Command(
                    `cd ${gulpConfig.dest.electron} && npm install`,
                    { verbosity: 0 },
                );

                setTimeout(
                    () =>
                        cmd.exec(null, () => resolve({ action, status: 200 })),
                    1,
                );
            }),

        complete: ({ action }) =>
            new Promise(resolve => {
                setTimeout(() => {
                    msg('Build', chalk.cyan('Complete') + '!');
                    console.log('\n');
                    resolve({ action, status: 200 });
                }, 3000);
            }),
    };
};
