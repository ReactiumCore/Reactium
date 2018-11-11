const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const op = require('object-path');
const handlebars = require('handlebars').compile;

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        create: ({ action, params }) => {
            message(`Creating ${chalk.cyan('something')}...`);

            return new Promise((resolve, reject) => {
                resolve({ action, status: 200 });
            });
        },
    };
};
