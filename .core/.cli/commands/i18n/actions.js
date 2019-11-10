const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const ShowConfigCli = require('gettext-extract');

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        generate: async ({ action, params, props }) => {
            const generator = new ShowConfigCli([]);
            message(`Generating ${chalk.cyan('POT file')}...`);
            try {
                generator.run();
            } catch (error) {
                console.log(error);
            }
            return Promise.resolve({ action, status: 200 });
        },
    };
};
