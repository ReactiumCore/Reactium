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
            message(`Creating ${chalk.cyan('zone component')}...`);

            const { destination } = params;
            const pluginFile = path.normalize(`${destination}/zone.js`);

            // Template content
            const template = path.normalize(`${__dirname}/template/zone.hbs`);
            const content = handlebars(fs.readFileSync(template, 'utf-8'))(
                params,
            );

            fs.ensureFileSync(pluginFile);
            fs.writeFileSync(
                pluginFile,
                prettier.format(content, {
                    parser: 'babel',
                    trailingComma: 'all',
                    singleQuote: true,
                    tabWidth: 4,
                    useTabs: false,
                }),
            );

            return Promise.resolve({ action, status: 200 });
        },
    };
};
