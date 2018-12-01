const ActionSequence = require('action-sequence');
const prettier = require('prettier');
const op = require('object-path');
const _ = require('underscore');

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
        console.log('');
        spinner.start();
    }

    let acts = [];
    switch (action) {
        case 'list':
            if (op.has(params, 'json')) {
                acts.push('object');
            } else {
                acts.push('list');
            }
            break;

        case 'add':
        case 'update':
            acts.push('create');
            if (cache) {
                acts.push('cache');
            }
            break;

        case 'remove':
            acts.push('remove');
            if (cache) {
                acts.push('cache');
            }
            break;

        case 'purge':
            acts.push('purge');
            if (cache) {
                acts.push('cache');
            }
            break;

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

    acts.push('result');
    const actions = _.pick(allActions, ...acts);

    if (actions.length < 1) {
        return Promise.resolve([]);
    }

    return ActionSequence({
        actions,
        options: { params, props },
    })
        .then(success => {
            if (spinner) {
                spinner.succeed(`${action} complete!`);
            }
            return success;
        })
        .catch(error => {
            if (spinner) {
                spinner.fail('error!');
            }
            return error;
        });
};
