const facilities = {};

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
    register: (registerCallback = noop) => {
        // Get Parse API if possible
        let Parse;
        try {
            Parse = require('appdir/api').default;
        } catch (error) {}

        registerCallback({
            deps: facilities.deps(),
            redux: facilities.redux,
            Parse,
        });
    },
};
