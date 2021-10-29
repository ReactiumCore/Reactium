import Reactium, { Hook, Enums } from 'reactium-core/sdk';

Enums.priority.core = Enums.priority.highest - 1000;

Reactium.Hook.register(
    'sdk-init',
    async () => {
        console.log('Adding Reactium.Routing');
        const { default: Routing } = await import('./routing');
        Reactium.Routing = Routing;
    },
    Enums.priority.core,
    'REACTIUM_CORE_Routing',
);

Reactium.Hook.register(
    'sdk-init',
    async () => {
        console.log('Attaching Reactium.i18n');
        const { default: i18n } = await import('./i18n');
        Reactium.i18n = i18n;
    },
    Enums.priority.core,
    'REACTIUM_CORE_i18n',
);

Reactium.Hook.register(
    'sdk-init',
    async () => {
        console.log('Attaching Reactium.Handle');
        const { Handle } = await import('@atomic-reactor/reactium-sdk-core');
        Reactium.Handle = Handle;
    },
    Enums.priority.core,
    'REACTIUM_CORE_Handle',
);

Reactium.Hook.register(
    'sdk-init',
    async () => {
        console.log('Attaching Reactium.Pulse');
        const { Pulse } = await import('@atomic-reactor/reactium-sdk-core');
        Reactium.Pulse = Pulse;
    },
    Enums.priority.core,
    'REACTIUM_CORE_Pulse',
);

Reactium.Hook.register(
    'sdk-init',
    async () => {
        console.log('Attaching Reactium.Prefs');
        const { Prefs } = await import('@atomic-reactor/reactium-sdk-core');
        Reactium.Prefs = Prefs;
    },
    Enums.priority.core,
    'REACTIUM_CORE_Prefs',
);

Reactium.Hook.register(
    'sdk-init',
    async () => {
        console.log('Attaching Reactium.Cache');
        const { Cache } = await import('@atomic-reactor/reactium-sdk-core');
        Reactium.Cache = Cache;
    },
    Enums.priority.core,
    'REACTIUM_CORE_Cache',
);
