import Plugin from '../plugin';
import { combineMiddlewares } from 'redux';
import Enums from '../enums';
import _ from 'underscore';

const Middleware = {};
const prematureCallError = Enums.Plugin.prematureCallError;

/**
 * @api {Function} Middleware.register(name,mw,order) Middleware.register()
 * @apiName Middleware.register
 * @apiDescription Register a new Redux middleware.
 This should be called only:
 1. within `Reactium.Plugin.register()` promise callback,
 2. or after the `plugin-dependencies` hook, (e.g. `plugin-init`)
 3. or after `Reactium.Plugin.ready === true`.
 * @apiParam {String} name the middleware's unique name
 * @apiParam {Function} mw Redux middleware high-order function (store => action => next => {})
 * @apiParam {Integer} [order=Enums.priority.neutral] Priority of the middleware respective to other existing Redux middleware.
 * @apiGroup Reatium.Middleware
 * @apiExample Example Usage:
import Reactium from 'reactium-core/sdk';
Reactium.Middleware.register('logger', store => action => next => {
    console.log(`action type ${action.type} dispatched.`, action);
    next(action);
});
 */
Middleware.register = (name, mw, order = Enums.priority.neutral) => {
    if (!Plugin.ready) {
        console.error(new Error(prematureCallError('Middleware.register()')));
        return;
    }

    if (name && typeof mw === 'function') {
        Plugin.redux.middlewares.push({
            name,
            mw,
            order,
        });

        Plugin.redux.store.replaceMiddlewares(
            _.sortBy(Plugin.redux.middlewares, 'order').map(({ mw }) => mw),
        );
    }
};

/**
 * @api {Function} Middleware.unregister(name) Middleware.unregister()
 * @apiName Middleware.unregister
 * @apiDescription Unregister a Redux middleware.
 This should be called only:
 1. within `Reactium.Plugin.register()` promise callback,
 2. or after the `plugin-dependencies` hook, (e.g. `plugin-init`)
 3. or after `Reactium.Plugin.ready === true`.
 * @apiParam {String} name the middleware's unique name
 * @apiGroup Reatium.Middleware
 * @apiExample Example Usage:
import Reactium from 'reactium-core/sdk';
Reactium.Middleware.unregister('logger');
 */
Middleware.unregister = removeName => {
    if (!Plugin.ready) {
        console.error(new Error(prematureCallError('Middleware.unregister()')));
        return;
    }

    if (removeName) {
        const mw = Plugin.redux.middlewares.find(
            ({ name }) => name === removeName,
        );

        if (mw) {
            Plugin.redux.middlewares = Plugin.redux.middlewares.filter(
                ({ name }) => name !== removeName,
            );
            Plugin.redux.store.replaceMiddlewares(
                _.sortBy(Plugin.redux.middlewares, 'order').map(({ mw }) => mw),
            );
        }
    }
};

export default Middleware;
