const ora = require('ora');
const ActionSequence = require('action-sequence');

const spinner = ora({
    spinner: 'dots',
    color: 'cyan',
});

module.exports = ({ action, params, props }) => {
    console.log('');

    spinner.start();

    const actions = require(`./actions/${action}`)(spinner);

    return ActionSequence({
        actions,
        options: { params, props },
    })
        .then(success => {
            spinner.succeed('complete!');
            return success;
        })
        .catch(error => {
            spinner.fail('error!');
            return error;
        });
};
