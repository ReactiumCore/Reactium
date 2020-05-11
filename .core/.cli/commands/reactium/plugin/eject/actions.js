const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const globby = require('globby').sync;
const { spawn } = require('child_process');
const labelGenerator = require('@atomic-reactor/cli/commands/config/set/generator');

const command = (cmd, args = [], done) => {
    const ps = spawn(cmd, args, {
        env: {
            PATH: process.env.PATH,
            NODE_ENV: 'production',
        },
    });

    ps.stdout.pipe(process.stdout, { end: false });
    ps.stderr.pipe(process.stderr, { end: false });
    process.stdin.resume();
    process.stdin.pipe(ps.stdin, { end: false });
    ps.on('close', code => {
        if (code !== 0) console.log(`Error executing ${cmd}`);
        done();
    });
};

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        build: async ({ action, params, props }) => {
            const { offerBuild } = params;

            if (offerBuild) {
                message(`Building ${chalk.cyan('Reactium manifest')}...`);
                await new Promise((resolve, reject) => {
                    command('gulp', ['manifest'], resolve);
                });

                message(`Building ${chalk.cyan('Reactium umd libraries')}...`);
                await new Promise((resolve, reject) => {
                    command('gulp', ['umdLibraries'], resolve);
                });
                message(`Building ${chalk.cyan('Reactium styles')}...`);
                await new Promise((resolve, reject) => {
                    command('gulp', ['styles'], resolve);
                });
            }
        },
        ejectAssets: async ({ action, params, props }) => {
            const { plugin, targetPath } = params;
            const { cwd } = props;

            const assets = globby([
                `${cwd}/public/assets/js/umd/${plugin}/${plugin}.js`,
                `${cwd}/public/assets/style/${plugin}-plugin.css`,
            ]);

            if (assets.length < 1) throw 'No assets to eject.';
            const assetsDir = path.resolve(targetPath, 'plugin-assets');
            message(`Copying ${chalk.cyan(`${plugin} assets`)}...`);

            fs.ensureDirSync(assetsDir);
            for (let asset of assets) {
                message(`Copying ${chalk.cyan(`${path.basename(asset)}`)}...`);
                fs.copySync(
                    asset,
                    path.resolve(assetsDir, path.basename(asset)),
                );
            }
        },

        addLabel: async ({ action, params, props }) => {
            const { plugin, targetPath, targetLabel, newConfig } = params;
            const { cwd } = props;

            if (targetLabel && newConfig) {
                await labelGenerator({ params, props });
            }
        },
    };
};
