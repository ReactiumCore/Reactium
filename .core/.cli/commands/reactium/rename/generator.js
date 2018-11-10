const ora = require('ora');
const ActionSequence = require('action-sequence');

const spinner = ora({
    spinner: 'dots',
    color: 'cyan',
});

const actions = require('./actions')(spinner);

module.exports = ({ params, props }) => {
    spinner.start();

    const { replace } = params;

    if (replace !== true) {
        delete actions.content;
    }

    return ActionSequence({
        actions,
        options: { params, props },
    })
        .then(success => {
            spinner.succeed('rename complete!');
            return success;
        })
        .catch(error => {
            spinner.fail('rename error');
            console.log(error);
            return error;
        });
};
