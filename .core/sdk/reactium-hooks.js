import Reactium from 'reactium-core/sdk';
import op from 'object-path';

Reactium.Hook.register(
    'capability-check',
    async (capabilities = [], strict = true, context) => {
        const permitted = await Reactium.Capability.check(capabilities, strict);
        op.set(context, 'permitted', permitted);
    },
    Reactium.Enums.priority.highest,
);
