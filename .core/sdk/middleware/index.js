import Plugin from '../plugin';
import { combineMiddlewares } from 'redux';
import Enums from '../enums';
import _ from 'underscore';

const Middleware = {};
const prematureCallError = Enums.Plugin.prematureCallError;

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
