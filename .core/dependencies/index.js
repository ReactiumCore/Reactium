import op from 'object-path';
import Reactium from 'reactium-core/sdk';

class ReactiumDependencies {
    constructor() {
        this.loaded = false;
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
            'allServices',
            'allMiddleware',
            'allEnhancers',
            'allPlugins',
        ];
    }

    _init() {
        if (this.loaded) return;

        this.loaded = true;
        this.reducers = this.manifest.allReducers;
        this.actions = this.manifest.allActions;
        this.actionTypes = Object.keys(this.manifest.allActionTypes).reduce(
            (types, key) => ({
                ...types,
                ...this.manifest.allActionTypes[key],
            }),
            {},
        );
        this.services = this.manifest.allServices;

        this.plugins = this.manifest.allPlugins;

        try {
            let plugableConfig = require('appdir/plugable');
            if ('default' in plugableConfig) {
                plugableConfig = plugableConfig.default;
            }
            this.plugableConfig = plugableConfig;
        } catch (error) {}

        // Resolve non-core types as dependencies
        Object.keys(this.manifest).forEach(type => {
            if (
                !this.coreTypes.find(
                    coreType => coreType === type || type === 'allHooks',
                )
            ) {
                this[type] = this.manifest[type];
            }
        });

        console.log('Dependencies loaded.');
    }
}

const dependencies = new ReactiumDependencies();

export default () => {
    if (!dependencies.loaded) {
        console.warning(
            new Error('Use of dependencies before dependencies-loaded.'),
        );
        throw dependencyError;
    }

    return dependencies;
};

export const restHeaders = () => {
    return {};
};

// File scoped
dependencies.manifest = require('manifest').get();
export const manifest = dependencies.manifest;

Reactium.Hook.register(
    'dependencies-load',
    () =>
        new Promise(resolve => {
            if (dependencies.loaded) resolve();

            const interval = setInterval(() => {
                const loaded =
                    typeof window !== 'undefined' ||
                    Object.entries(dependencies.manifest)
                        .filter(([type]) => type !== 'allHooks')
                        .reduce(
                            (loaded, [, dependency]) => loaded && !!dependency,
                            true,
                        );
                if (loaded) {
                    clearInterval(interval);
                    dependencies._init();
                    resolve();
                }
            }, 100);
        }),
    Reactium.Enums.priority.highest,
);
