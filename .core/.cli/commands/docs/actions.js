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
            message(`Creating ${chalk.cyan('docs')}...`);

            let { src, dest, verbose } = params;

            dest = String(dest)
                .replace(/ /gi, '')
                .split(',');
            dest = _.flatten([dest]);

            dest.forEach(d => {
                createDoc({
                    src,
                    dest: d,
                    lineEnding: '\n',
                    debug: verbose,
                    verbose,
                });
            });

            return Promise.resolve({ action, status: 200 });
        },
    };
};
