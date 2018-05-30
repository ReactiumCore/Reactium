import NotFound from 'reactium-core/components/NotFound';

class ReactiumDependencies {
    constructor() {
        this.routes = [];
        this.actions = {};
        this.actionTypes = {};
        this.services = {};
    }

    init() {
        this.actions = this.manifest.allActions;
        this.actionTypes = Object.keys(this.manifest.allActionTypes).reduce((types, key) => ({
            ...types,
            ...this.manifest.allActionTypes[key],
        }), {});
        this.services = this.manifest.allServices;

        this.routes = Object.keys(this.manifest.allRoutes)
        .map(route => this.manifest.allRoutes[route])
        .reduce((rts, route) => {
            // Support multiple routable components per route file
            if ( Array.isArray(route) ) {
                return [...rts,
                    ...route.map((subRoute, subKey) => ({
                        order: 0,
                        ...subRoute,
                    }))
                ];
            }

            // Support one routable component
            return [...rts, {
                order: 0,
                ...route,
            }];
        }, [])
        .reduce((rts, route) => {
            // Support multiple paths for one route
            if ( Array.isArray(route.path) ) {
                return [...rts, ...route.path.map(path => ({
                    ...route,
                    path,
                }))];
            }
            return [...rts, route];
        }, [])
        .sort((a,b) => a.order - b.order)
        .concat([{ component: NotFound }]);
    }
}

const dependencies = new ReactiumDependencies();

export default dependencies;

export const restHeaders = () => {
    return {};
};

// File scoped
dependencies.manifest = require('manifest').get();
