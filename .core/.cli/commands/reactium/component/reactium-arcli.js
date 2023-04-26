import formatRoute from './formatRoute.cjs';
import componentGen from './componentGen.cjs';
import formatDestination from './formatDestination.cjs';
import selectDestination from './selectDestination.cjs';
import selectStyleDefault from './selectStyle.cjs';
import camelcase from 'camelcase';

const { selectStyle, styleTypes } = selectStyleDefault;
const { _, chalk, prefix, Reactium } = arcli;

const cc = str => camelcase(str, { pascalCase: true });
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
                name: 'name',
                message: 'Component Name',
            },
            {
                prefix,
                suffix,
                type: 'input',
                name: 'route',
                message: 'Route',
            },
            {
                prefix,
                suffix,
                default: true,
                type: 'confirm',
                name: 'hooks',
                message: 'Reactium Hooks?',
            },
            {
                prefix,
                suffix,
                default: true,
                type: 'confirm',
                name: 'domain',
                message: 'Domain file?',
            },
            {
                prefix,
                suffix,
                default: false,
                type: 'confirm',
                name: 'style',
                message: 'Stylesheet?',
            },
            selectStyle({
                name: 'styleType',
                when: answers => answers.style === true,
            }),
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

    if (typeof params.name === 'string') {
        params.className = String(params.name).toLowerCase();
        params.name = cc(params.name);
        params.index = true;

        if (!String(params.destination).endsWith(params.name)) {
            params.destination = arcli.normalizePath(
                params.destination,
                params.name,
            );
        }
    }

    if (typeof params.style === 'string') {
        params.styleType = params.style;
        params.style = true;
    }

    if (params.style === true) {
        const styleType =
            _.findWhere(styleTypes, { name: params.styleType }) ||
            _.first(styleTypes);

        params.styleType = styleType.value;
    }

    if (typeof params.route === 'string') {
        params.route = formatRoute(params.route);
    }
};

// Register default hooks
Reactium.Hook.register(
    'arcli-component-input',
    INPUT,
    Reactium.Enums.priority.highest,
    'arcli-component-input',
);

Reactium.Hook.register(
    'arcli-component-confirm',
    CONFIRM,
    Reactium.Enums.priority.highest,
    'arcli-component-confirm',
);

Reactium.Hook.register(
    'arcli-component-conform',
    CONFORM,
    Reactium.Enums.priority.highest,
    'arcli-component-conform',
);

Reactium.Hook.register(
    'arcli-component-preflight',
    PREFLIGHT,
    Reactium.Enums.priority.highest,
    'arcli-component-preflight',
);

Reactium.Hook.register(
    'arcli-component-actions',
    ({ actions }) => (actions['component'] = componentGen),
    Reactium.Enums.priority.highest,
    'arcli-component-actions',
);
