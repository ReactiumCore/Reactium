const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const moment = require('moment');
const { spawn } = require('child_process');

module.exports = () => {
    let appUI;
    let appE;
    let tick = 0;

    const timestamp = `\n\n\n\n\n[${chalk.magenta(
        moment().format('HH:mm:ss'),
    )}] [${chalk.cyan('UPLOADER')}]`;

    return {
        init: ({ action, params, props }) => {
            console.log(timestamp, chalk.bgGreen('  Starting  '));
            console.log('');

            return Promise.resolve({ action, status: 200 });
        },
        reactium: ({ action, params, props }) =>
            new Promise((resolve, reject) => {
                const { ui } = params;
                const p = path.join(ui, 'gulpfile.js');

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

                        const { electron } = params;

                        appE = spawn('electron', [electron], {
                            env: {
                                ...process.env,
                                NODE_ENV: 'development',
                            },
                        });
                        appE.stdout.pipe(process.stdout);
                        appE.stderr.pipe(process.stderr);

                        setTimeout(
                            () => resolve({ action, status: 200 }),
                            2000,
                        );
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
