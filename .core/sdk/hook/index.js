const uuid = require('uuid/v4');
const _ = require('underscore');
const op = require('object-path');
const ActionSequence = require('action-sequence');

const noop = () => Promise.resolve();

const Hook = {
    action: {
        middleware: {},
        install: {},
        start: {},
        uninstall: {},
        activate: {},
        deactivate: {},
        warning: {},
    },
    silent: ['warning', 'install'],
    chill: {
        install: 0,
    },
};

Hook.flush = name => op.set(Hook.action, name, {});

Hook.unregister = id =>
    Object.keys(Hook.action).forEach(action => {
        op.del(Hook.action, `${action}.${id}`);
    });

Hook.register = (name, callback, order = 100, id) => {
    id = id || uuid();
    op.set(Hook.action, `${name}.${id}`, { id, order, callback });
    return id;
};

Hook.list = () => Object.keys(Hook.action).sort();

Hook.run = (name, ...params) => {
    const context = { hook: name, params };

    const actions = _.sortBy(
        Object.values(op.get(Hook.action, `${name}`, {})),
        'order',
    ).reduce((acts, action) => {
        const { callback = noop, id } = action;
        acts[id] = () => callback(...params, context);
        return acts;
    }, {});

    return ActionSequence({ actions }).then(() => {
        return context;
    });
};

module.exports = Hook;
