import Reactium from 'reactium-core/sdk';
import op from 'object-path';
import getComponents from 'dependencies/getComponents';

Reactium.Hook.register('routes-init', async context => {
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

    context.routes = Object.values(allRoutes || {})
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
        }, []);

    return Promise.resolve();
});

Reactium.Hook.register('404-component', async context => {
    let { NotFound = null } = getComponents([{ type: 'NotFound' }]);
    context.NotFound = NotFound;

    return Promise.resolve();
});
