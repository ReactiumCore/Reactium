import op from 'object-path';

class ReactiumDependencies {
    constructor() {
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

    setManifest(manifest) {
        this.manifest = manifest;

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
            if (!this.coreTypes.find(coreType => coreType === type)) {
                this[type] = this.manifest[type];
            }
        });
    }
}

const dependencies = new ReactiumDependencies();

export default () => dependencies;

export const restHeaders = () => {
    return {};
};

// File scoped
dependencies.manifest = require('manifest').get();
