const ora = require('ora');
const path = require('path');
const op = require('object-path');
const ActionSequence = require('action-sequence');
const mod = path.dirname(require.main.filename);

const spinner = ora({
    spinner: 'dots',
    color: 'cyan',
});

const actions = require('./actions')(spinner);

module.exports = ({ params, props }) => {
    spinner.start();

    if (!op.get(params, 'overwrite', false)) {
        delete actions.backup;
    }

    if (!op.get(params, 'redux', false)) {
        const noredux = [
            'redux',
            'subclass',
            'actions',
            'actionTypes',
            'reducers',
            'state',
        ];
        noredux.forEach(exclude => {
            delete actions[exclude];
        });
    }

    const excludes = [
        'actions',
        'actionTypes',
        'reducers',
        'route',
        'services',
    ];
    excludes.forEach(exclude => {
        if (!op.get(params, exclude, false)) {
            delete actions[exclude];
        }
    });

    if (op.get(params, 'stylesheet', false)) {
        try {
            const styleActions = require('../style/actions')(spinner);
            delete styleActions.backup;

            actions['stylesheet'] = ({ action, params, props }) =>
                ActionSequence({
                    actions: styleActions,
                    options: { params: params.stylesheet, props },
                });
        } catch (err) {
            return new Promise((resolve, reject) => {
                reject(err);
            });
        }
    }

    switch (params.type) {
        case 'functional':
            delete actions.class;
            break;

        case 'class':
            delete actions.functional;
            break;
    }

    return ActionSequence({
        actions,
        options: { params, props },
    })
        .then(success => {
            spinner.succeed('all actions complete!');
            return success;
        })
        .catch(error => {
            console.log(error);
            spinner.fail('error!');
            return error;
        });
};
