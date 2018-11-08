import op from 'object-path';

export const getComponents = (elms = []) => {
    const contexts = {
        components: require.context('components', true, /\.jsx?$/),
        common: require.context('components/common-ui/', true, /\.jsx?$/),
        toolkit: require.context('toolkit', true, /\.jsx?$/),
        core: require.context('reactium-core/components', true, /\.jsx?$/),
    };

    let cmps = {};

    // Traverse the Array of bindable elements and require the components for them
    elms.forEach(elm => {
        let req;
        let { type, path } = elm;

        // The path to the component
        path = !path ? type : path;
        Object.entries(contexts).forEach(([name, context]) => {
            [
                `./${path}/index.js`,
                `./${path}/index.jsx`,
                `./${path}.js`,
                `./${path}.jsx`,
            ].forEach(attempt => {
                // Exit if the component has already been defined
                if (cmps[type]) {
                    return;
                }

                const found = context.keys().find(key => key === attempt);
                if (found) {
                    const id = context.resolve(attempt);

                    req = context(attempt);

                    // Check if the component has a .default
                    // -> if so: set that as the component constructor
                    req = 'default' in req ? req.default : req;
                }

                if (req) {
                    cmps[type] = req;
                }
            });
        });
    });

    // Output the Components Object
    return cmps;
};

let { NotFound = null } = getComponents([{ type: 'NotFound' }]);

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
