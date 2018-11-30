const ActionSequence = require('action-sequence');
const prettier = require('prettier');

/**
 params: {
   node: true,              // Boolean - Scan node_modules.
   activity: true,          // Boolean - Show activity spinner.
   save: true,              // Boolean - Execute save action.
 }

 props: {
   cwd: proccess.cwd(),    // String - The process.cwd() value.
 }
*/
module.exports = ({ params, props }) => {
    const { activity = false, save = false } = params;

    const spinner = activity
        ? require('ora')({
              spinner: 'dots',
              color: 'cyan',
          })
        : null;

    const actions = require('./actions')(spinner);

    if (spinner) {
        spinner.start();
    }

    if (!save) {
        delete actions.save;
    }

    return ActionSequence({
        actions,
        options: { params, props },
    })
        .then(success => {
            if (spinner) {
                spinner.succeed('complete!');
            }

            if (success.length === 1) {
                return prettier.format(JSON.stringify(success[0]['zones']), {
                    parser: 'babylon',
                });
            } else {
                return success;
            }
        })
        .catch(error => {
            if (spinner) {
                spinner.fail('error!');
            }
            return error;
        });
};
