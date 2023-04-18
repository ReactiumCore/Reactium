import op from 'object-path';
import _ from 'underscore';
import Reactium, { isBrowserWindow } from 'reactium-core/sdk';
import manifestLoader from 'manifest';

class ReactiumDependencies {
    constructor() {
        this.loaded = false;
        this.loadedModules = {};
        this.services = {};
        this.plugins = {};
        this.plugableConfig = {};

        // Just used to determine if is a custom type
        this.coreTypes = ['allServices', 'allPlugins', 'allHooks'];

        // Things to be mapped on deps now
        this.coreTypeMap = {
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
        return _.compact(
            await Promise.all(
                op.get(this.manifest, [type], []).map(async dep => {
                    try {
                        const { name, domain, loader } = dep;
                        const { load = true } = await Reactium.Hook.run(
                            'load-dependency',
                            { name, domain, module },
                            Reactium.Enums.priority.highest,
                            'REACTIUM-DEP-MODULE-LOAD',
                        );

                        if (load) {
                            if (op.has(this, ['loadedModules', name, domain])) {
                                const loadedModule = op.get(this, [
                                    'loadedModules',
                                    name,
                                    domain,
                                ]);

                                return loadedModule;
                            } else {
                                const loadedModule = await loader();
                                const { name, domain } = loadedModule;

                                op.set(
                                    this,
                                    ['loadedModules', name, domain],
                                    loadedModule,
                                );

                                return loadedModule;
                            }
                        }
                    } catch (error) {
                        console.error('loadAll error', error);
                        return Promise.resolve(undefined);
                    }

                    return;
                }),
            ),
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
