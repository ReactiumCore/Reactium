/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const chalk = require('chalk');
const generator = require('./generator');
const prettier = require('prettier');
const path = require('path');
const fs = require('fs-extra');
const op = require('object-path');
const _ = require('underscore');
const mod = path.dirname(require.main.filename);
const slugify = require('slugify');
const { error, message } = require(`${mod}/lib/messenger`);
const pad = require(`${mod}/lib/pad`);
const M = require('../zones/manifest')();

const overwritable = prompt => {
    let overwrite;

    try {
        overwrite =
            prompt.override['overwrite'] || prompt.history('overwrite').value;
    } catch (err) {
        overwrite = true;
    }

    overwrite = overwrite === '' ? true : overwrite;

    return overwrite;
};

const formatDestination = ({ val, props }) => {
    const { cwd } = props;

    val = path.normalize(val);
    val = String(val).replace(/^~\/|^\/cwd\/|^cwd\/|^cwd$/i, `${cwd}/`);
    val = String(val).replace(
        /^\/core\/|^core\/|^core/i,
        `${cwd}/.core/components/`,
    );
    val = String(val).replace(
        /^\/components\/|^components\/|^components$/i,
        `${cwd}/src/app/components/`,
    );
    val = String(val).replace(
        /^\/common-ui\/|^common-ui\/|^common-ui$/i,
        `${cwd}/src/app/components/common-ui/`,
    );

    return path.normalize(val);
};

const NAME = 'plugin';

const DESC = 'Reactium: plugin helper.';

const CANCELED = 'Plugin canceled!';

const CONFIRM = ({ props, params, msg }) => {
    const { prompt } = props;

    msg = msg || chalk.white('Proceed?');

    return new Promise((resolve, reject) => {
        prompt.get(
            {
                properties: {
                    confirmed: {
                        description: `${msg} ${chalk.cyan('(Y/N):')}`,
                        type: 'string',
                        required: true,
                        pattern: /^y|n|Y|N/,
                        message: ` `,
                        before: val => {
                            return String(val).toLowerCase() === 'y';
                        },
                    },
                },
            },
            (error, input = {}) => {
                const confirmed = op.get(input, 'confirmed', false);
                if (error || confirmed === false) {
                    reject(error);
                } else {
                    params['confirmed'] = true;
                    resolve(params);
                }
            },
        );
    });
};

const CONFORM = ({ input, props }) => {
    const { cwd } = props;

    const output = Object.keys(input).reduce((obj, key) => {
        let val = input[key];

        switch (key) {
            case 'id':
                obj[key] = slugify(val).toUpperCase();
                break;

            case 'destination':
                obj[key] = formatDestination({ val, props });
                break;

            case 'zone':
                obj[key] = val.split(' ').map(index => GET_ZONE(index));
                break;

            case 'order':
                obj[key] = Number(val);
                break;

            default:
                obj[key] = val;
                break;
        }

        return obj;
    }, {});

    return output;
};

const HELP = () =>
    console.log(`
Example:
  $ arcli plugin --destination cwd/components/MyComponent --id "my-plugin"
`);

const FLAGS = ['overwrite', 'destination', 'zone', 'id', 'component', 'order'];

const FLAGS_TO_PARAMS = ({ opt = {} }) =>
    FLAGS.reduce((obj, key) => {
        let val = opt[key];
        val = typeof val === 'function' ? undefined : val;

        if (val) {
            obj[key] = val;
        }

        return obj;
    }, {});

const PREFLIGHT = ({ params }) => {
    const msg = 'A new plugin will be created with the following options:';
    const preflight = _.pick(params, ...Object.keys(params).sort());

    message(msg);

    console.log(
        prettier.format(JSON.stringify(preflight), {
            parser: 'json-stringify',
        }),
    );
};

const ZONE_LIST = () =>
    Object.keys(M).map((zone, index) => {
        index += 1;
        const len = String(Object.keys(M).length).length;
        const i = chalk.cyan(pad(index, len) + '.');
        return `  ${i} ${zone}`;
    });

const GET_ZONE = index => {
    return !isNaN(Number(index)) ? Object.keys(M)[index - 1] : index;
};

const SCHEMA = ({ props }) => {
    const { cwd, prompt } = props;

    return {
        properties: {
            destination: {
                description: chalk.white('Destination:'),
                required: true,
                message: ' Plugin destination is required',
            },
            overwrite: {
                required: true,
                pattern: /^y|n|Y|N/,
                message: '',
                description: `${chalk.white(
                    'Overwrite existing plugin?',
                )} ${chalk.cyan('(Y/N):')}`,
                ask: () => {
                    try {
                        let val =
                            prompt.override['destination'] ||
                            prompt.history('destination').value;
                        val = formatDestination({ val, props });

                        return fs.existsSync(
                            path.normalize(`${val}/plugin.js`),
                        );
                    } catch (err) {
                        return false;
                    }
                },
                before: val => {
                    return String(val).toUpperCase() === 'Y';
                },
            },
            id: {
                required: true,
                message: ' Plugin ID is required',
                description: chalk.white('Plugin ID:'),
                ask: () => overwritable(prompt),
            },
            component: {
                required: true,
                message: ' Component is required',
                description: chalk.white('Component:'),
                ask: () => overwritable(prompt),
            },
            zone: {
                message: ' Zone is required',
                description: chalk.white('Zones:'),
                ask: () => overwritable(prompt),
            },
            zone: {
                description: `${chalk.white('Zone:')}\n\t ${ZONE_LIST().join(
                    '\n\t ',
                )}\n   ${chalk.white('Select:')}`,
                type: 'string',
                required: true,
                message: ' Select zones',
                ask: () => overwritable(prompt),
                before: val =>
                    String(val)
                        .replace(/, /, ' ')
                        .replace(/\s+/g, ' ')
                        .trim(),
            },
            order: {
                pattern: /[0-9\-]/,
                required: true,
                message: ' Order must be valid integer',
                description: chalk.white('Order:'),
                ask: () => overwritable(prompt),
            },
        },
    };
};

const ACTION = ({ opt, props }) => {
    if (Object.keys(M).length < 1) {
        return error(
            `no plugin zones found.\n\nRun:\n${chalk.cyan(
                '  $ arcli zones scan',
            )}\n or:\n${chalk.cyan('  $ arcli zones add')}`,
        );
    }

    console.log('');

    let params;
    const { cwd, prompt } = props;
    const schema = SCHEMA({ props });
    const ovr = FLAGS_TO_PARAMS({ opt });

    prompt.override = ovr;
    prompt.start();

    return new Promise((resolve, reject) => {
        prompt.get(schema, (err, input = {}) => {
            if (err) {
                prompt.stop();
                reject(`${NAME} ${err.message}`);
                return;
            }

            input = { ...ovr, ...input };
            params = CONFORM({ input, props });

            if (op.get(params, 'overwrite', false) !== true) {
                prompt.stop();
                reject(CANCELED);
                return;
            }

            PREFLIGHT({ params, props });

            resolve(params);
        });
    })
        .then(() => {
            return CONFIRM({ props, params });
        })
        .then(() => {
            console.log('');
            return generator({ action: 'create', params, props });
        })
        .then(results => {
            console.log('');
        })
        .catch(err => {
            prompt.stop();
            message(op.get(err, 'message', CANCELED));
        });
};

const COMMAND = ({ program, props }) =>
    program
        .command(NAME)
        .description(DESC)
        .action(opt => ACTION({ opt, props }))
        .option('-d, --destination [destination]', 'Plugin parent directory.')
        .option('--overwrite [overwrite]', 'Overwrite existing plugin file.')
        .option(
            '-i, --id [id]',
            'Unique identifier for the plugin. Used when rendering the plugin to the dom.',
        )
        .option('-c, --component [component]', 'The plugin component.')
        .option(
            '-z, --zone [zone]',
            'Plugin zones. For multiple zones supply a comma separated list.',
        )
        .option(
            '-o, --order [order]',
            'Order in which to load the plugin. Lower number plugins get loaded first.',
        )
        .on('--help', HELP);

module.exports = {
    COMMAND,
    NAME,
};
