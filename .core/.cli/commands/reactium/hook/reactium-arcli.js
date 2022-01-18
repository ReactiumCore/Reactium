const componentGen = require('../component/componentGen');
const selectDestination = require('../component/selectDestination');
const formatDestination = require('../component/formatDestination');

const { _, chalk, path, prefix, Reactium } = arcli;

const suffix = chalk.magenta(': ');

const PREFLIGHT = ({ msg, params }) => {
    arcli.message(msg || 'Preflight checklist:');
    console.log(JSON.stringify(params, null, 2));
    console.log('');
};

const INPUT = async ({ inquirer, params }) => {
    const input = await inquirer.prompt([selectDestination()], params);
    Object.entries(input).forEach(([key, val]) => (params[key] = val));
};

const CONFIRM = async ({ inquirer, params }) => {
    if (params.unattended) return;

    const input = await inquirer.prompt([
        {
            prefix,
            suffix,
            default: false,
            type: 'confirm',
            name: 'confirm',
            message: 'Proceed?',
        },
    ]);

    Object.entries(input).forEach(([key, val]) => (params[key] = val));
};

const CONFORM = async ({ params }) => {
    params.hooks = true;
    params.name = path.basename(params.destination);
    params.destination = formatDestination(params.destination);
};

// Register default hooks
Reactium.Hook.register(
    'arcli-hook-input',
    INPUT,
    Reactium.Enums.priority.highest,
    'arcli-hook-input',
);

Reactium.Hook.register(
    'arcli-hook-confirm',
    CONFIRM,
    Reactium.Enums.priority.highest,
    'arcli-hook-confirm',
);

Reactium.Hook.register(
    'arcli-hook-conform',
    CONFORM,
    Reactium.Enums.priority.highest,
    'arcli-hook-conform',
);

Reactium.Hook.register(
    'arcli-hook-preflight',
    PREFLIGHT,
    Reactium.Enums.priority.highest,
    'arcli-hook-preflight',
);

Reactium.Hook.register(
    'arcli-hook-actions',
    ({ actions }) => (actions['component'] = componentGen),
    Reactium.Enums.priority.highest,
    'arcli-hook-actions',
);
