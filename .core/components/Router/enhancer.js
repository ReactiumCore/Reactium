import Reactium from 'reactium-core/sdk';
import queryString from 'querystring-browser';
import { matchPath } from 'react-router';
import op from 'object-path';
import deps from 'dependencies';

const routeListener = (store, history) => async location => {
    const state = store.getState();
    const Router = op.get(state, 'Router', {});
    let routes = Reactium.Routing.get();

    const pathChanged =
        !Router.pathname || location.pathname !== Router.pathname;
    const searchChanged = location.search !== Router.search;

    if (pathChanged || searchChanged) {
        let { route, match } =
            routes
                .filter(route => route.path)
                .map(route => {
                    let match = matchPath(location.pathname, route);
                    return { route, match };
                })
                .filter(route => route.match)
                .find(({ route, match }) => {
                    return match.isExact;
                }) || {};

        if (match) {
            // optionally load route data
            const search = queryString.parse(
                location.search.replace(/^\?/, ''),
            );
            if ('load' in route && typeof route.load === 'function') {
                await Promise.resolve(route.load(match.params, search))
                    .then(thunk => thunk(store.dispatch, store.getState, store))
                    .then(data =>
                        Reactium.Hook.run(
                            'data-loaded',
                            data,
                            route,
                            match.params,
                            search,
                        ),
                    );
            }

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
                    match,
                    route,
                    params: match.params,
                    search,
                }),
            );
        }
    }
};

export default (enhancers = [], isServer = false) => {
    return [
        {
            name: 'route-observer',
            order: 999,
            enhancer: isServer
                ? _ => _
                : storeCreator => (...args) => {
                      const store = storeCreator(...args);

                      Reactium.Hook.register(
                          'history-create',
                          async ({ history }) => {
                              routeListener(store, history)(window.location);
                              history.listen(routeListener(store, history));

                              return Promise.resolve();
                          },
                          Reactium.Enums.priority.high,
                      );

                      return store;
                  },
        },
        ...enhancers,
    ];
};
