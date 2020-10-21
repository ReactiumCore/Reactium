import Reactium from 'reactium-core/sdk';
import queryString from 'querystring-browser';
import { matchPath } from 'react-router';
import op from 'object-path';
import deps from 'dependencies';

const historyHandler = store => async ({ active: current }) => {
    const location = Reactium.Routing.history.location;
    const match = current.match;

    if (match) {
        const { params, search } = current;
        const route = op.get(current, 'match.route');
        const store = Reactium.Redux.store;

        let data;
        if ('thunk' in route && typeof route.thunk === 'function') {
            const maybeThunk = route.thunk(params, search);
            if (typeof maybeThunk === 'function')
                data = await Promise.resolve(
                    maybeThunk(store.dispatch, store.getState, store),
                );
        }

        await Reactium.Hook.run('data-loaded', data, route, params, search);

        store.dispatch(
            deps().actions.Router.updateRoute({
                history,
                location: {
                    pathname: location.pathname,
                    search: location.search,
                    hash: location.hash,
                    state: location.state,
                    key: location.key,
                },
                match: match.match,
                route,
                params,
                search,
            }),
        );
    }
};

export default (enhancers = [], isServer = false) => {
    const name = 'load-thunk-route-observer';
    return [
        {
            name,
            order: 999,
            enhancer: isServer
                ? _ => _
                : storeCreator => (...args) => {
                      const store = storeCreator(...args);

                      Reactium.Routing.routeListeners.register(name, {
                          handler: historyHandler(store),
                      });

                      return store;
                  },
        },
        ...enhancers,
    ];
};
