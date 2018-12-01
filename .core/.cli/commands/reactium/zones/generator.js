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
module.exports = ({ action, params, props }) => {
    const { activity, cache } = params;

    const spinner = activity
        ? require('ora')({
              spinner: 'dots',
              color: 'cyan',
          })
        : null;

    const allActions = require('./actions')(spinner);

    if (spinner) {
        spinner.start();
    }

    let success;
    let acts = [];
    switch (action) {
        case 'scan':
            acts.push('scan');

            if (cache) {
                acts.push('cache');
            }

            break;
    }

    if (acts.length < 1) {
        return Promise.resolve([]);
    }

    const actions = acts.reduce((obj, act) => {
        obj[act] = allActions[act];
        return obj;
    }, {});

    return ActionSequence({
        actions,
        options: { params, props },
    })
        .then(success => {
            if (spinner) {
                spinner.succeed(`${action} complete!`);
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
