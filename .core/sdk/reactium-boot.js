const Enums = ReactiumBoot.Enums;
Enums.priority.core = Enums.priority.highest - 1000;

ReactiumBoot.Hook.register(
    'sdk-init',
    async () => {
        console.log('Attaching Reactium.Routing');
        const { default: Routing } = await import('./routing');
        ReactiumBoot.Routing = Routing;
    },
    Enums.priority.core,
    'REACTIUM_CORE_Routing',
);

ReactiumBoot.Hook.register(
    'sdk-init',
    async () => {
        console.log('Attaching Reactium.i18n');
        const { default: i18n } = await import('./i18n');
        ReactiumBoot.i18n = i18n;
    },
    Enums.priority.core,
    'REACTIUM_CORE_i18n',
);

ReactiumBoot.Hook.register(
    'sdk-init',
    async () => {
        console.log('Attaching Reactium.Handle');
        const { Handle } = await import('@atomic-reactor/reactium-sdk-core');
        ReactiumBoot.Handle = Handle;
    },
    Enums.priority.core,
    'REACTIUM_CORE_Handle',
);

ReactiumBoot.Hook.register(
    'sdk-init',
    async () => {
        console.log('Attaching Reactium.Pulse');
        const { Pulse } = await import('@atomic-reactor/reactium-sdk-core');
        ReactiumBoot.Pulse = Pulse;
    },
    Enums.priority.core,
    'REACTIUM_CORE_Pulse',
);

ReactiumBoot.Hook.register(
    'sdk-init',
    async () => {
        console.log('Attaching Reactium.Cache');
        const { Cache } = await import('@atomic-reactor/reactium-sdk-core');
        ReactiumBoot.Cache = Cache;
    },
    Enums.priority.core,
    'REACTIUM_CORE_Cache',
);
