const ora = require('ora');
const ActionSequence = require('action-sequence');

module.exports = ({ params, props }) => {
    console.log('');
    const spinner = ora({
        spinner: 'dots',
        color: 'cyan',
    });

    spinner.start();

    const actions = require('./actions')(spinner);

    return ActionSequence({
        actions,
        options: { params, props },
    })
        .then(success => {
            spinner.succeed('complete!');
            console.log('');
            return success;
        })
        .catch(error => {
            spinner.fail('error!');
            return error;
        });
};
