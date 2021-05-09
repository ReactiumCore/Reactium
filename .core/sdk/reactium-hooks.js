import op from 'object-path';

const hooks = async () => {
    const { default: Reactium } = await import('reactium-core/sdk');

    Reactium.Hook.register(
        'capability-check',
        async (capabilities = [], strict = true, context) => {
            const permitted = await Reactium.Capability.check(
                capabilities,
                strict,
            );
            op.set(context, 'permitted', permitted);
        },
        Reactium.Enums.priority.highest,
    );
};

hooks();
