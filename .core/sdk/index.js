import SDK from '@atomic-reactor/reactium-sdk-core';
import i18n from './i18n';
import Routing from './routing';

export * from '@atomic-reactor/reactium-sdk-core';
export * from './named-exports';

const apiHandler = {
    get(SDK, prop) {
        if (prop in SDK) return SDK[prop];
        if (SDK.API) {
            if (prop in SDK.API) return SDK.API[prop];
            if (SDK.API.Actinium && prop in SDK.API.Actinium)
                return SDK.API.Actinium[prop];
        }
    },

    set(SDK, prop, value) {
        // optionally protect SDK props by hook
        const { ok = true } = SDK.Hook.runSync(
            'reactium-sdk-set-prop',
            prop,
            value,
        );
        if (ok) {
            SDK[prop] = value;
        }

        return true;
    },
};

export default new Proxy(
    Object.assign(SDK, {
        i18n,
        Routing,
    }),
    apiHandler,
);
