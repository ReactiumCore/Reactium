const componentGen = require('../component/componentGen');
const formatRoute = require('../component/formatRoute');
const formatDestination = require('../component/formatDestination');
const selectDestination = require('../component/selectDestination');

const { _, chalk, prefix, Reactium } = arcli;

const suffix = chalk.magenta(': ');

const PREFLIGHT = ({ msg, params }) => {
    arcli.message(msg || 'Preflight checklist:');
    console.log(JSON.stringify(params, null, 2));
    console.log('');
};

const INPUT = async ({ inquirer, params }) => {
    const input = await inquirer.prompt(
        [
            selectDestination(),
            {
                prefix,
                suffix,
                type: 'input',
                name: 'route',
                message: 'Route',
            },
        ],
        params,
    );

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
    params.destination = formatDestination(params.destination);

    if (typeof params.route === 'string') {
        params.route = formatRoute(params.route);
    }
};

// Register default hooks
Reactium.Hook.register(
    'arcli-route-input',
    INPUT,
    Reactium.Enums.priority.highest,
    'arcli-route-input',
);

Reactium.Hook.register(
    'arcli-route-confirm',
    CONFIRM,
    Reactium.Enums.priority.highest,
    'arcli-route-confirm',
);

Reactium.Hook.register(
    'arcli-route-conform',
    CONFORM,
    Reactium.Enums.priority.highest,
    'arcli-route-conform',
);

Reactium.Hook.register(
    'arcli-route-preflight',
    PREFLIGHT,
    Reactium.Enums.priority.highest,
    'arcli-route-preflight',
);

Reactium.Hook.register(
    'arcli-route-actions',
    ({ actions }) => (actions['component'] = componentGen),
    Reactium.Enums.priority.highest,
    'arcli-route-actions',
);
