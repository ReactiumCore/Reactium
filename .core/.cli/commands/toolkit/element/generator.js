const ora = require('ora');
const op = require('object-path');
const ActionSequence = require('action-sequence');

const spinner = ora({
    spinner: 'dots',
    color: 'cyan',
});

const reduceCreate = ({ actions, params, props }) => {
    const newActions = { ...actions };

    if (op.get(params, 'overwrite', false) !== true) {
        delete newActions.backup;
    }

    if (op.get(params, 'hideDocs', false)) {
        delete newActions.readme;
    }

    if (op.get(params, 'stylesheet', false)) {
        try {
            const styleActions = require('../../reactium/style/actions')(
                spinner
            );
            delete styleActions.backup;

            newActions['stylesheet'] = ({ action, params, props }) =>
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

    return { actions: newActions, params };
};

const reduceUpdate = ({ actions, params, props }) => {
    const { destination: from, menuOrder: prevIndex } = params.prev;

    const { destination: to, menuOrder: index } = params.new;

    if (prevIndex === index) {
        delete params.new.menuOrder;
        delete params.prev.menuOrder;
    }

    if (from === to) {
        delete actions.backup;
        delete actions.copy;
        delete actions.remove;
    }

    return { actions, params };
};

const reduce = ({ action, actions, params, props }) => {
    let output = { actions, params };
    switch (action) {
        case 'create':
            output = reduceCreate({ actions, params, props });
            break;

        case 'update':
            output = reduceUpdate({ actions, params, props });
            break;
    }

    return output;
};

const successMessage = ({ action, overwrite }) => {
    let success;
    switch (action) {
        case 'create':
            success =
                overwrite === true ? 'Element updated!' : 'Element created!';

            break;

        case 'update':
            success = 'Element updated!';
            break;

        case 'remove':
            success = 'Element removed!';
            break;

        case 'move':
            success = 'Element moved!';
            break;
    }

    return success;
};

module.exports = ({ params, props }) => {
    spinner.start();

    const { overwrite } = params;

    let action = op.has(params, 'remove') ? 'remove' : 'create';
    action = op.has(params, 'update') ? 'update' : action;

    let reduced = reduce({
        action,
        params,
        props,
        actions: require(`./actions/${action}`)(spinner),
    });

    let actions = reduced.actions;
    params = reduced.params;

    const msg = successMessage({ action, overwrite });

    return ActionSequence({
        actions,
        options: { params, props },
    })
        .then(success => {
            spinner.succeed(msg);
            return success;
        })
        .catch(error => {
            spinner.fail('error!');
            return error;
        });
};
