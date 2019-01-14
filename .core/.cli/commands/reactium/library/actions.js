const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const handlebars = require('handlebars').compile;

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        create: ({ action, params, props }) => {
            const { cwd } = props;
            const { destination, component } = params;

            message(
                `Creating ${chalk.white(component)} ${chalk.cyan(
                    'library.js',
                )}...`,
            );

            const filepath = path.normalize(
                path.join(destination, 'library.js'),
            );

            fs.ensureDirSync(path.normalize(destination));

            const template = path.normalize(
                `${__dirname}/template/library.hbs`,
            );

            const content = handlebars(fs.readFileSync(template, 'utf-8'))(
                params,
            );

            return new Promise((resolve, reject) => {
                fs.writeFile(filepath, content, error => {
                    if (error) {
                        reject(error.Error);
                    } else {
                        setTimeout(resolve, 1000, { action, status: 200 });
                    }
                });
            });
        },
    };
};
