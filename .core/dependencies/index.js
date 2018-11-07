import op from 'object-path';

let NotFound = require('reactium-core/components/NotFound').default;

try {
    NotFound = require('components/NotFound').default;
} catch (err) {}

class ReactiumDependencies {
    constructor() {
        this.routes = [];
        this.actions = {};
        this.actionTypes = {};
        this.services = {};
        this.reducers = {};
        this.plugins = {};
    }

    update() {
        dependencies.manifest = require('manifest').get();
        dependencies.init();
        console.log('[Reactium HMR] - Refreshing dependencies');
    }

    init() {
        this.reducers = this.manifest.allReducers;
        this.actions = this.manifest.allActions;
        this.actionTypes = Object.keys(this.manifest.allActionTypes).reduce(
            (types, key) => ({
                ...types,
                ...this.manifest.allActionTypes[key],
            }),
            {}
        );
        this.services = this.manifest.allServices;

        this.routes = Object.keys(this.manifest.allRoutes)
            .map(route => this.manifest.allRoutes[route])
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
            .sort((a, b) => a.order - b.order)
            .concat([{ component: NotFound }]);

        this.plugins = Object.entries(this.manifest.allPlugins).reduce(
            (plugins, [domain, plugin]) => {
                const zone = op.get(plugins, plugin.zone, []);
                plugins[plugin.zone] = zone
                    .concat([plugin])
                    .sort((a, b) => a.order - b.order);
                return plugins;
            },
            {}
        );
    }
}

const dependencies = new ReactiumDependencies();

export default dependencies;

export const restHeaders = () => {
    return {};
};

// File scoped
dependencies.manifest = require('manifest').get();
