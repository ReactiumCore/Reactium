const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const run = require('gulp-run');
const op = require('object-path');
const moment = require('moment');
const { spawn } = require('child_process');

const timestamp = () => `[${chalk.magenta(moment().format('HH:mm:ss'))}]`;
const msg = (...msg) => console.log(timestamp(), ...msg);

let cwd;
let gulpConfig;
let reactiumConfig;

module.exports = () => {
    let appUI;
    let appE;
    let tick = 0;

    return {
        setup: ({ action, params, props }) => {
            cwd = op.get(props, 'cwd');
            reactiumConfig = require(path.join(
                cwd,
                '.core',
                'reactium-config.js',
            ));

            gulpConfig = reactiumConfig.build;

            const buildDir = path.join(
                cwd,
                op.get(gulpConfig, 'dest.electron', 'build-electron'),
            );

            if (!fs.existsSync(buildDir)) {
                msg(
                    'Run the',
                    `${chalk.cyan('$ arcli electron-build')}`,
                    'command before continuing',
                );
                console.log('\n');
                console.log(`${chalk.magenta('Action cancelled')}!`);
                console.log('\n');

                process.exit(0);
            } else {
                msg('Electron', chalk.cyan('initializing') + '...');
                return Promise.resolve({ action, status: 200 });
            }
        },
        reactium: ({ action, params, props }) =>
            new Promise((resolve, reject) => {
                msg('Reactium', chalk.cyan('building') + '...');

                const { ui } = params;
                const p = path.join(ui, 'gulpfile.js');
                let launching = false;

                appUI = spawn('gulp', ['local', '--gulpfile', p, '--color'], {
                    env: { ...process.env, NODE_ENV: 'development' },
                });

                appUI.stderr.pipe(process.stderr);
                appUI.stdout.pipe(process.stdout);
                appUI.stdout.on('data', data => {
                    if (!appE) {
                        if (
                            data.toString().indexOf('Compiled successfully') >
                            -1
                        ) {
                            tick += 1;
                        }
                        if (data.toString().indexOf('UI External') > -1) {
                            tick += 1;
                        }

                        if (tick < 2) {
                            return;
                        }

                        if (launching === true) {
                            return;
                        }

                        launching = true;

                        setTimeout(
                            () => msg('Launching', chalk.cyan('app') + '...'),
                            500,
                        );

                        setTimeout(() => {
                            msg('Launched', chalk.cyan('app') + '!');

                            const { electron } = params;
                            appE = spawn('electron', [electron], {
                                env: {
                                    ...process.env,
                                    NODE_ENV: 'development',
                                },
                            });
                            appE.stdout.pipe(process.stdout);
                            appE.stderr.pipe(process.stderr);

                            resolve({ action, status: 200 });
                        }, 5000);
                    }
                });

                process.on('SIGINT', () => {
                    try {
                        appUI.kill();
                    } catch (err) {}

                    try {
                        appE.kill();
                    } catch (err) {}

                    process.exit(0);
                });
            }),
    };
};
