const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const prettier = require('prettier');
const handlebars = require('handlebars').compile;

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        plugin: ({ action, params, props }) => {
            message(`Creating ${chalk.cyan('plugin')}...`);

            const { destination } = params;
            const pluginFile = path.normalize(`${destination}/plugin.js`);

            const plugin = JSON.stringify(
                _.pick(params, 'id', 'component', 'order', 'zone'),
            );

            const cont =
                '\n\n' +
                prettier.format(`export default ${plugin}`, {
                    parser: 'babel',
                });

            fs.ensureFileSync(pluginFile);
            fs.writeFileSync(pluginFile, cont);

            return Promise.resolve({ action, status: 200 });
        },
    };
};
