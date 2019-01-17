const ora = require('ora');
const path = require('path');
const op = require('object-path');
const ActionSequence = require('action-sequence');
const mod = path.dirname(require.main.filename);

module.exports = ({ params, props }) => {
    const spinner = ora({
        spinner: 'dots',
        color: 'cyan',
    });

    spinner.start();

    const actions = require('./actions')(spinner);

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
            return Promise.reject(err);
        }
    }

    if (op.get(params, 'plugin', false)) {
        try {
            const pluginActions = require('../plugin/actions')(spinner);
            const pluginParams = {
                destination: params.destination,
                id: `${String(params.name).toUpperCase()}-PLUGIN`,
                component: params.name,
                order: 1000,
                zone: [],
            };

            actions['plugin'] = ({ params, props }) =>
                ActionSequence({
                    actions: pluginActions,
                    options: { params: pluginParams, props },
                });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    if (op.get(params, 'library', false)) {
        try {
            const libraryActions = require('../library/actions')(spinner);
            const libraryParams = {
                destination: params.destination,
                component: params.name,
                from: './index',
            };
            actions['library'] = ({ params, props }) =>
                ActionSequence({
                    actions: libraryActions,
                    options: { params: libraryParams, props },
                });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    if (op.get(params, 'test', false)) {
        try {
            const testActions = require('../test/actions')(spinner);
            const testParams = {
                destination: params.destination,
                component: params.name,
                from: op.get(params, 'redux', false)
                    ? `./${params.name}`
                    : './index',
            };
            actions['test'] = ({ params, props }) =>
                ActionSequence({
                    actions: testActions,
                    options: { params: testParams, props },
                });
        } catch (err) {
            return Promise.reject(err);
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
