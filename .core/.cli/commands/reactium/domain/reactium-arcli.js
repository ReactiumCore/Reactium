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
    params.domain = true;
    params.destination = formatDestination(params.destination);
    params.name = path.basename(params.destination);
};

// Register default hooks
Reactium.Hook.register(
    'arcli-domain-input',
    INPUT,
    Reactium.Enums.priority.highest,
    'arcli-domain-input',
);

Reactium.Hook.register(
    'arcli-domain-confirm',
    CONFIRM,
    Reactium.Enums.priority.highest,
    'arcli-domain-confirm',
);

Reactium.Hook.register(
    'arcli-domain-conform',
    CONFORM,
    Reactium.Enums.priority.highest,
    'arcli-domain-conform',
);

Reactium.Hook.register(
    'arcli-domain-preflight',
    PREFLIGHT,
    Reactium.Enums.priority.highest,
    'arcli-domain-preflight',
);

Reactium.Hook.register(
    'arcli-domain-actions',
    ({ actions }) => (actions['component'] = componentGen),
    Reactium.Enums.priority.highest,
    'arcli-domain-actions',
);
