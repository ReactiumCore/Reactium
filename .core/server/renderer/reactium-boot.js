// Create a stub redux store
ReactiumBoot.Hook.register(
    'store-create',
    async (config, context) => {
        context.store = { dispatch: () => {}, getState: () => ({}) };
    },
    ReactiumBoot.Enums.priority.highest,
    'CORE_STUB_REDUX_STORE',
);
