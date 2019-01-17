import op from 'object-path';

export const getComponents = (elms = []) => {
    let cmps = {};
    if (typeof window !== 'undefined') {
        const contexts = require('manifest').contexts;

        // Traverse the Array of bindable elements and require the components for them
        elms.forEach(({ type, path }) => {
            let req;

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
    }

    // SSR and not found component cases
    elms.forEach(({ type, path }) => {
        if (!cmps[type]) {
            cmps[type] = () => null;
        }
    });

    // Output the Components Object
    return cmps;
};

let { NotFound = null } = getComponents([{ type: 'NotFound' }]);

class ReactiumDependencies {
    constructor() {
        this.manifest = {};
        this.routes = [];
        this.actions = {};
        this.actionTypes = {};
        this.services = {};
        this.reducers = {};
        this.plugins = {};
        this.plugableConfig = {};
        this.coreTypes = [
            'allActions',
            'allActionTypes',
            'allReducers',
            'allInitialStates',
            'allRoutes',
            'allServices',
            'allMiddleware',
            'allEnhancers',
            'allPlugins',
        ];
    }

    setManifest(manifest) {
        this.manifest = manifest || {};

        // Provide placeholder for non-core types
        Object.keys(this.manifest).forEach(type => {
            if (!this.coreTypes.find(coreType => coreType === type)) {
                this[type] = {};
            }
        });
    }

    update() {
        this.setManifest(require('manifest').get());
        this.init();
        console.log('[Reactium HMR] - Refreshing dependencies');
    }

    init() {
        this.reducers = op.get(this.manifest, 'allReducers', {});
        this.actions = op.get(this.manifest, 'allActions', {});
        this.actionTypes = Object.keys(
            op.get(this.manifest, 'allActionTypes', {}),
        ).reduce(
            (types, key) => ({
                ...types,
                ...op.get(this.manifest, 'allActionTypes', {})[key],
            }),
            {},
        );
        this.services = op.get(this.manifest, 'allServices', {});

        this.routes = Object.keys(op.get(this.manifest, 'allRoutes', {}))
            .map(route => op.get(this.manifest, 'allRoutes', {})[route])
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

        this.plugins = op.get(this.manifest, 'allPlugins', {});

        try {
            let plugableConfig = require('appdir/plugable');
            if ('default' in plugableConfig) {
                plugableConfig = plugableConfig.default;
            }
            this.plugableConfig = plugableConfig;
        } catch (error) {}

        // Resolve non-core types as dependencies
        Object.keys(op.get(this, 'manifest', {})).forEach(type => {
            if (!this.coreTypes.find(coreType => coreType === type)) {
                this[type] = this.manifest[type];
            }
        });
    }
}

const dependencies = new ReactiumDependencies();

export default dependencies;

export const restHeaders = () => {
    return {};
};

// File scoped
dependencies.setManifest(require('manifest').get());
