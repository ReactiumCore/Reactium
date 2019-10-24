import uuid from 'uuid/v4';
import _ from 'underscore';
import op from 'object-path';
import ActionSequence from 'action-sequence';
import Enums from '../enums';

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

/**
 * @api {Function} Hook.flush(name) Clear all registered callbacks for a hook.
 * @apiName Hook.flush
 * @apiDescription Clear all registered callbacks for a hook.
 * @apiParam {String} name the hook name
 * @apiGroup Hook
 */
Hook.flush = name => op.set(Hook.action, name, {});

/**
 * @api {Function} Hook.unregister(id) Unregister a registered callback by id.
 * @apiName Hook.unregister
 * @apiDescription Unregister a registered callback by id.
 * @apiParam {String} id the unique id provided by Hook.register() or Hook.list()
 * @apiGroup Hook
 */
Hook.unregister = id =>
    Object.keys(Hook.action).forEach(action => {
        op.del(Hook.action, `${action}.${id}`);
    });

/**
 * @api {Function} Hook.register(name,callback,order,id) Register a hook callback.
 * @apiName Hook.register
 * @apiDescription Register a hook callback.
 * @apiParam {String} name the hook name
 * @apiParam {Function} callback function returning promise that will be called when the hook is run.
 The hook callback will receive any parameters provided to Hook.run, followed by a context object.
 * @apiParam {Integer} [order=Enums.priority.neutral] order of which the callback will be called when this hook is run.
 * @apiParam {String} [id] the unique id. If not provided, a uuid will be generated
 * @apiGroup Hook
 * @apiExample Example Usage
import Reactium from 'reactium-core/sdk';
Reactium.Hook.register('plugin-init', () => {
    console.log('Plugins initialized!');
    return Promise.resolve();
}, Enums.priority.highest);
*/
Hook.register = (name, callback, order = Enums.priority.neutral, id) => {
    id = id || uuid();
    op.set(Hook.action, `${name}.${id}`, { id, order, callback });
    return id;
};

/**
 * @api {Function} Hook.list() Register a hook callback.
 * @apiName Hook.list
 * @apiDescription Register a hook callback.
 * @apiGroup Hook
 */
Hook.list = () => Object.keys(Hook.action).sort();

/**
 * @api {Function} Hook.run(name,...params) Run hook callbacks.
 * @apiName Hook.run
 * @apiDescription Run hook callbacks.
 * @apiParam {String} name the hook name
 * @apiParam {Mixed} ...params any number of arbitrary parameters (variadic)
 * @apiSuccess {Object} context context object passed to each callback (after other variadic parameters)
 * @apiGroup Hook
 */
Hook.run = (name, ...params) => {
    const actions = _.sortBy(
        Object.values(op.get(Hook.action, `${name}`, {})),
        'order',
    ).reduce((acts, action) => {
        const { callback = noop, id } = action;
        acts[id] = ({ context }) => callback(...params, context);
        return acts;
    }, {});

    return ActionSequence({ actions, context: { hook: name, params } });
};

export default Hook;
