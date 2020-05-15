const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const globby = require('globby').sync;
const { spawn } = require('child_process');
const labelGenerator = require('@atomic-reactor/cli/commands/config/set/generator');

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        toggle: async ({ action, params, props }) => {
            const { plugin } = params;
            message(
                `Toggling ${chalk.cyan(plugin.name)} ${chalk.cyan(
                    !plugin.development ? 'on' : 'off',
                )}...`,
            );

            let conf = {};
            if (fs.existsSync(plugin.confPath)) {
                try {
                    conf = JSON.parse(fs.readFileSync(plugin.confPath, 'utf8'));
                } catch (err) {}
            }

            conf.development = !op.get(plugin, 'development', false);
            fs.writeFileSync(
                plugin.confPath,
                JSON.stringify(conf, null, 2),
                'utf8',
            );
        },
    };
};
