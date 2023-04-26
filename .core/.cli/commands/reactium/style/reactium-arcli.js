import componentGen from '../component/componentGen.cjs';
import formatDestination from '../component/formatDestination.cjs';
import selectDestination from '../component/selectDestination.cjs';
import selectStyleDefault from '../component/selectStyle.cjs';

const { _, chalk, Reactium } = arcli;

const { selectStyle, styleTypes } = selectStyleDefault;

const PREFLIGHT = ({ msg, params }) => {
    arcli.message(msg || 'Preflight checklist:');
    console.log(JSON.stringify(params, null, 2));
    console.log('');
};

const INPUT = async ({ inquirer, params }) => {
    const input = await inquirer.prompt(
        [selectDestination(), selectStyle({ name: 'type' })],
        params,
    );

    Object.entries(input).forEach(([key, val]) => (params[key] = val));
};

const CONFIRM = async ({ inquirer, params }) => {
    if (params.unattended) return;

    const input = await inquirer.prompt([
        {
            default: false,
            type: 'confirm',
            name: 'confirm',
            message: 'Proceed?',
            prefix: arcli.prefix,
            suffix: chalk.magenta(': '),
        },
    ]);

    Object.entries(input).forEach(([key, val]) => (params[key] = val));
};

const CONFORM = async ({ params }) => {
    params.style = true;
    params.destination = formatDestination(params.destination);

    if (typeof params.type === 'string') {
        const styleType =
            _.findWhere(styleTypes, { name: params.type }) ||
            _.first(styleTypes);

        params.styleType = styleType.value;
        delete params.type;
    }
};

// Register default hooks
Reactium.Hook.register(
    'arcli-style-input',
    INPUT,
    Reactium.Enums.priority.highest,
    'arcli-style-input',
);

Reactium.Hook.register(
    'arcli-style-confirm',
    CONFIRM,
    Reactium.Enums.priority.highest,
    'arcli-style-confirm',
);

Reactium.Hook.register(
    'arcli-style-conform',
    CONFORM,
    Reactium.Enums.priority.highest,
    'arcli-style-conform',
);

Reactium.Hook.register(
    'arcli-style-preflight',
    PREFLIGHT,
    Reactium.Enums.priority.highest,
    'arcli-style-preflight',
);

Reactium.Hook.register(
    'arcli-style-actions',
    ({ actions }) => (actions['component'] = componentGen),
    Reactium.Enums.priority.highest,
    'arcli-style-actions',
);
