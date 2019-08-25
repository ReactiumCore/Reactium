import op from 'object-path';
import deps from 'dependencies';
import getComponents from 'dependencies/getComponents';
import moment from 'moment';

let { NotFound = null } = getComponents([{ type: 'NotFound' }]);

export default () => {
    const allRoutes = op.get(require('manifest').get(), 'allRoutes', {});

    if (!Object.values(allRoutes || {}).length) {
        return [];
    }

    let dynamicRoutes = [];
    if (typeof window !== 'undefined') {
        if ('routes' in window && Array.isArray(window.routes)) {
            dynamicRoutes = window.routes;
        }
    } else {
        if ('routes' in global && Array.isArray(global.routes)) {
            dynamicRoutes = global.routes;
        }
    }

    let routes = Object.values(allRoutes || {})
        .concat(
            dynamicRoutes.map(route => {
                let Found = getComponents([{ type: route.component }]);

                return {
                    ...route,
                    component: op.get(Found, route.component, () => null),
                };
            }),
        )
        .filter(route => route)
        .reduce((rts, route) => {
            // Support multiple routable components per route file
            if (Array.isArray(route)) {
                return [
                    ...rts,
                    ...route.map((subRoute, subKey) => ({
                        order: 0,
                        ...subRoute,
                    })),
                ];
            }

            // Support one routable component
            return [
                ...rts,
                {
                    order: 0,
                    ...route,
                },
            ];
        }, [])
        .reduce((rts, route) => {
            // Support multiple paths for one route
            if (Array.isArray(route.path)) {
                return [
                    ...rts,
                    ...route.path.map(path => ({
                        ...route,
                        path,
                    })),
                ];
            }
            return [...rts, route];
        }, [])
        .sort((a, b) => (a.order < b.order ? -1 : a.order > b.order ? 1 : 0))
        .concat([{ component: NotFound, order: 1000 }]);
    return routes;
};
