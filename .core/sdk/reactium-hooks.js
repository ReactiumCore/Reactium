import Reactium, { Hook, Enums } from 'reactium-core/sdk';

Enums.priority.core = Enums.priority.highest - 1000;

Reactium.Hook.register(
    'sdk-init',
    async () => {
        const { default: Routing } = await import('./routing');
        Reactium.Routing = Routing;
    },
    Enums.priority.core,
    'REACTIUM_CORE_Routing',
);

Reactium.Hook.register(
    'sdk-init',
    async () => {
        const { default: i18n } = await import('./i18n');
        Reactium.i18n = i18n;
    },
    Enums.priority.core,
    'REACTIUM_CORE_i18n',
);
