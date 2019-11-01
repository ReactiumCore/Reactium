const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const { createDoc } = require('apidoc');

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        create: async ({ action, params, props }) => {
            const { src, dest, verbose } = params;

            createDoc({
                src,
                dest,
                lineEnding: '\n',
                debug: verbose,
                verbose,
            });

            message(`Creating ${chalk.cyan('docs')}...`);

            return Promise.resolve({ action, status: 200 });
        },
    };
};
