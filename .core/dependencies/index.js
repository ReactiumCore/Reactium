import op from 'object-path';
import Reactium, { isBrowserWindow } from 'reactium-core/sdk';
import manifestLoader from 'manifest';

class ReactiumDependencies {
    constructor() {
        this.loaded = false;
        this.loadedModules = {};
        this.actions = {};
        this.actionTypes = {
            DOMAIN_UPDATE: 'DOMAIN_UPDATE',
        };
        this.services = {};
        this.reducers = {};
        this.plugins = {};
        this.plugableConfig = {};

        // Just used to determine if is a custom type
        this.coreTypes = [
            'allActionTypes',
            'allActions',
            'allReducers',
            'allInitialStates',
            'allServices',
            'allMiddleware',
            'allEnhancers',
            'allPlugins',
            'allHooks',
        ];

        // Things to be mapped on deps now
        this.coreTypeMap = {
            allActionTypes: 'actionTypes',
            allActions: 'actions',
            allServices: 'services',
            allPlugins: 'plugins',
        };
    }

    async loadAllMerged(type) {
        const all = await this.loadAll(type);

        return all.reduce(
            (merged, current) => ({
                ...merged,
                [current.domain]: current.module.default,
            }),
            {},
        );
    }

    async loadAllDefaults(type) {
        return (await this.loadAll(type)).map(dep => {
            return dep.module.default;
        });
    }

    async loadAll(type) {
        return Promise.all(
            op.get(this.manifest, [type], []).map(dep => {
                const { name, domain, loader } = dep;
                if (op.has(this, ['loadedModules', name, domain])) {
                    const loadedModule = op.get(this, [
                        'loadedModules',
                        name,
                        domain,
                    ]);
                    return Promise.resolve(loadedModule);
                } else {
                    return dep.loader().then(loadedModule => {
                        const { name, domain, module } = loadedModule;

                        op.set(
                            this,
                            ['loadedModules', name, domain],
                            loadedModule,
                        );
                        return loadedModule;
                    });
                }
            }),
        );
    }

    async load() {
        if (!this.loaded) {
            console.log('Loading core dependencies.');
            for (const depType of Object.keys(this.manifest)) {
                if (
                    depType in this.coreTypeMap ||
                    !this.coreTypes.includes(depType)
                ) {
                    const binding = op.get(
                        this.coreTypeMap,
                        [depType],
                        depType,
                    );
                    for (const { name, domain, module } of await this.loadAll(
                        depType,
                    )) {
                        op.set(this, [binding, domain], module.default);
                        if (binding === 'actionTypes') {
                            for (const [key, value] of Object.entries(
                                module.default,
                            )) {
                                op.set(this, [binding, key], value);
                            }
                        } else {
                            op.set(this, [binding, domain], module.default);
                        }
                    }
                }
            }

            try {
                let plugableConfig = await import('appdir/plugable');
                if ('default' in plugableConfig) {
                    plugableConfig = plugableConfig.default;
                }
                this.plugableConfig = plugableConfig;
            } catch (error) {}

            this.loaded = true;
        }

        return Promise.resolve(this);
    }
}

const dependencies = new ReactiumDependencies();

export default () => dependencies;

export const restHeaders = () => {
    return {};
};

// File scoped
try {
    dependencies.manifest = manifestLoader.get();
} catch (error) {
    if (isBrowserWindow()) {
        console.error('Error loading dependencies from manifest.', error);
    } else {
        console.error(
            'Error loading dependencies from manifest on server.',
            error,
        );
    }
}

export const manifest = dependencies.manifest;

Reactium.Hook.register(
    'dependencies-load',
    dependencies.load.bind(dependencies),
    Reactium.Enums.priority.highest,
);
