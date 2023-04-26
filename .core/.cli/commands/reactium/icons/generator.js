import ora from 'ora';
import ACTIONS from './actions.js';
import ActionSequence from 'action-sequence';

export default async ({ params, props }) => {
    const spinner = ora({
        spinner: 'dots',
        color: 'cyan',
    });

    spinner.start();

    const actions = ACTIONS(spinner);

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
