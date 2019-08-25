import { getHistory } from 'reactium-core/components/Router/browser';
import { matchPath } from 'react-router';
import op from 'object-path';
import getRoutes from '../getRoutes';
import deps from 'dependencies';

const routeListener = (store, history) => location => {
    const state = store.getState();
    const Router = op.get(state, 'Router', {});
    let routes = op.get(state, 'Routes.routes');
    if (!routes) {
        routes = getRoutes();
        store.dispatch(deps().actions.Routes.init(routes));
    }

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
            }),
        );
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
                      const history = getHistory();
                      routeListener(store, history)(window.location);
                      history.listen(routeListener(store, history));
                      return store;
                  },
        },
        ...enhancers,
    ];
};
