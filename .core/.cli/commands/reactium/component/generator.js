const ora = require('ora');
const path = require('path');
const op = require('object-path');
const ActionSequence = require('action-sequence');
const mod = path.dirname(require.main.filename);
const _ = require('underscore');

module.exports = ({ params, props }) => {
    const spinner = ora({
        spinner: 'dots',
        color: 'cyan',
    });

    spinner.start();

    const actions = require('./actions')(spinner);

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
    } else {
        delete actions.index;
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

    if (op.get(params, 'zone', false)) {
        try {
            const zoneActions = require('../plugin/component/actions')(spinner);
            const zoneParams = {
                destination: params.destination,
                id: `${String(params.name).toUpperCase()}-ZONE`,
                component: params.name,
                order: 1000,
                zone: [],
            };

            actions['zone'] = ({ params, props }) =>
                ActionSequence({
                    actions: zoneActions,
                    options: { params: zoneParams, props },
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

    if (
        _.intersection(
            Object.keys(params).filter(key => op.get(params, key)),
            [
                'route',
                'redux',
                'actions',
                'actionTypes',
                'plugin',
                'reducers',
                'zone',
                'services',
            ],
        ).length < 1
    ) {
        delete actions.domain;
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
