const facilities = {};

export const pluginAddons = {};
export const pluginRegistration = {
    setDeps: deps => (facilities.deps = deps),
    setStore: ({ store, allReducers, middlewares }) => {
        facilities.redux = {
            store,
            middlewares,
            reducers: allReducers,
        };
    },
};

const noop = () => {};
export default {
    register: ({
        registerCallback,
        name = '',
        pluginMappers = [],
        pluginFilters = [],
        pluginSorts = [],
    }) => {
        // Get Parse API if possible
        let Parse;
        try {
            Parse = require('appdir/api').default;
        } catch (error) {}

        if (!name || name.length < 1 || name in pluginAddons) {
            throw 'Third party plugin addons must provide register a unique name.';
        }

        registerCallback({
            deps: facilities.deps(),
            redux: facilities.redux,
            Parse,
        });

        pluginAddons[name] = {
            name,
            pluginMappers,
            pluginFilters,
            pluginSorts,
        };
    },
};
