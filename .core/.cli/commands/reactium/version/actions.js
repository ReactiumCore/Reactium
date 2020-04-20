const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        create: ({ action, params, props }) => {
            message(`Creating ${chalk.cyan('something')}...`);
            console.log(props.config);
        },
    };
};
