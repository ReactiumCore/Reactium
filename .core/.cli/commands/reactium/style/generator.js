const ora = require('ora');
const chalk = require('chalk');
const ActionSequence = require('action-sequence');

const spinner = ora({
    spinner: 'dots',
    color: 'cyan',
});

const actions = require('./actions')(spinner);

module.exports = ({ params, props }) => {
    spinner.start();

    const { filename, overwrite } = params;

    const successMsg =
        overwrite === true
            ? `Overwrote stylesheet ${chalk.cyan(filename)}`
            : `Added style sheet ${chalk.cyan(filename)}`;

    const errorMsg =
        overwrite === true
            ? `Unable to overwrite stylesheet ${chalk.cyan(filename)}`
            : `Unable to add stylesheet ${chalk.cyan(filename)}`;

    return ActionSequence({
        actions,
        options: { params, props },
    })
        .then(success => {
            spinner.succeed(successMsg);
            return success;
        })
        .catch(error => {
            spinner.fail(errorMsg);
            return error;
        });
};
