const Enums = ReactiumBoot.Enums;
Enums.priority.core = Enums.priority.highest - 1000;

ReactiumBoot.Hook.register(
    'sdk-init',
    async () => {
        const { default: Routing } = await import('./routing');
        ReactiumBoot.Routing = Routing;
    },
    Enums.priority.core,
    'REACTIUM_CORE_Routing',
);

ReactiumBoot.Hook.register(
    'sdk-init',
    async () => {
        const { default: i18n } = await import('./i18n');
        ReactiumBoot.i18n = i18n;
    },
    Enums.priority.core,
    'REACTIUM_CORE_i18n',
);
