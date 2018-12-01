/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
const path = require('path');
const mod = path.dirname(require.main.filename);

const chalk = require('chalk');
const generator = require('./generator');
const prettier = require('prettier');
const _ = require('underscore');
const op = require('object-path');
const { error, message } = require(`${mod}/lib/messenger`);
const pad = require(`${mod}/lib/pad`);
const M = require('./manifest')();

const zoneList = () => {
    const keys = Object.keys(M).length;
    return keys.map((zone, index) => {
        index += 1;
        const i = chalk.cyan(pad(index, len) + '.');
        return `  ${i} ${zone}`;
    });
};

const getZone = index => {
    if (!isNaN(Number(index))) {
        index -= 1;
        return Object.keys(M)[index];
    } else {
        if (op.has(M, index)) {
            return index;
        }
    }
};

/**
 * NAME String
 * @description Constant defined as the command name. Value passed to the commander.command() function.
 * @example $ arcli zones
 * @see https://www.npmjs.com/package/commander#command-specific-options
 * @since 2.0.0
 */
const NAME = 'zones <action>';

/**
 * DESC String
 * @description Constant defined as the command description. Value passed to
 * the commander.desc() function. This string is also used in the --help flag output.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const DESC = 'Scan the current project for Plugin zones';

/**
 * CANCELED String
 * @description Message sent when the command is canceled
 * @since 2.0.0
 */
const CANCELED = 'zones ACTION canceled';

/**
 * confirm({ props:Object, params:Object }) Function
 * @description Prompts the user to confirm the operation
 * @since 2.0.0
 */
const CONFIRM = ({ props, params, msg = 'Proceed?' }) => {
    const { prompt } = props;

    return new Promise((resolve, reject) => {
        prompt.get(
            {
                properties: {
                    confirmed: {
                        description: `${chalk.white(msg)} ${chalk.cyan(
                            '(Y/N):',
                        )}`,
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
                if (error || !op.get(input, 'confirmed')) {
                    reject(error);
                } else {
                    resolve(params);
                }
            },
        );
    });
};

/**
 * conform(input:Object) Function
 * @description Reduces the input object.
 * @param input Object The key value pairs to reduce.
 * @since 2.0.0
 */
const CONFORM = ({ action, input, props }) => {
    let output = {};

    Object.entries(input).forEach(([key, val]) => {
        switch (key) {
            default:
                output[key] = val;
                break;
        }
    });

    if (action === 'scan') {
        delete output.id;
        delete output.description;
    }

    return output;
};

/**
 * HELP Function
 * @description Function called in the commander.on('--help', callback) callback.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const HELP = () => {
    console.log('');
    console.log('Example:');
    console.log('');
    console.log(
        ' Scan the source code for plugin zones and exclude the node_modules directory while scanning.',
    );
    console.log('  $ arcli zones scan --no-node');
    console.log('');
    console.log(' Add a plugin zone to the plugins manifest.');
    console.log(
        '  $ arcli zones add --id my-plugin --description "Awesome plugin zone!"',
    );
    console.log('');
};

const FLAGS = ['id', 'description', 'node', 'cache', 'activity', 'source'];

/**
 * SCHEMA Function
 * @description used to describe the input for the prompt function.
 * @see https://www.npmjs.com/package/prompt
 * @since 2.0.0
 */
const SCHEMA = ({ action, props, zone = {} }) => {
    const { prompt } = props;

    const output = {
        properties: {
            id: {
                required: true,
                description: chalk.white('Zone:'),
                message: ' Plugin zone is required',
                default: op.get(zone, 'id'),
                ask: () => {
                    if (!op.has(prompt, 'override.id')) {
                        return ['add', 'remove', 'update'].includes(action);
                    } else {
                        return false;
                    }
                },
            },
            description: {
                required: true,
                description: chalk.white('Description:'),
                message: ' Plugin description is required',
                default: op.get(zone, 'description'),
                ask: () => {
                    if (!op.has(prompt, 'override.description')) {
                        return ['add', 'update'].includes(action);
                    } else {
                        return false;
                    }
                },
            },
        },
    };

    // TODO: Update - Lookup the
    if (action === 'update') {
    }

    return output;
};

const SCHEMA_SELECT = ({ action, opt, props }) => {
    return {
        properties: {
            id: {
                description: `${chalk.white('Zone:')} ${zoneList().join(
                    '',
                )}\n    ${chalk.white('Select:')}`,
                type: 'string',
                required: true,
                message: ' select a zone',
                before: val => {
                    return getZone(val);
                },
            },
        },
    };
};

const PREFLIGHT = ({ action, params }) => {
    let msg;
    switch (action) {
        case 'add':
            console.log(
                'A plugin zone with the following options will be added:',
            );
            console.log('');
            console.log(
                prettier.format(JSON.stringify(params), {
                    parser: 'json-stringify',
                }),
            );
            break;

        case 'update':
            console.log(
                `The plugin zone ${chalk.cyan(
                    op.get(params, 'id'),
                )} will be updated with the following options`,
            );
            console.log('');
            console.log(
                prettier.format(JSON.stringify(params), {
                    parser: 'json-stringify',
                }),
            );
            break;

        case 'remove':
            msg = `Are you sure you want to remove the ${chalk.cyan(
                op.get(params, 'id'),
            )} zone?`;
            break;
    }

    return msg;
};

const ACTION_SELECT = ({ action, opt, props }) => {
    if (Object.keys(M).length < 1) {
        return error(
            `no zones found.\n\nRun:\n${chalk.cyan(
                '  $ arcli zones scan',
            )}\n or:\n${chalk.cyan('  $ arcli zones add')}`,
        );
    }

    // TODO: use SCHEMA_SELECT to draw the list of zones to choose from
};

/**
 * ACTION Function
 * @description Function used as the commander.action() callback.
 * @see https://www.npmjs.com/package/commander
 * @param opt Object The commander options passed into the function.
 * @param props Object The CLI props passed from the calling class `orcli.js`.
 * @since 2.0.0
 */
const ACTION = ({ action, opt, props }) => {
    const id = op.get(opt, 'id');

    if (['update', 'remove'].includes(action) && !id) {
        ACTION_SELECT({ action, opt, props });
        return;
    }

    if (id && !op.has(M, id)) {
        action = 'add';
    }

    const { prompt } = props;

    const flags = FLAGS.reduce((obj, key) => {
        let val = opt[key];
        val = typeof val === 'function' ? undefined : val;

        if (val) {
            obj[key] = val;
        }

        return obj;
    }, {});

    let schema;

    switch (action) {
        case 'update':
            break;

        default:
            schema = SCHEMA({ action, props });
    }

    console.log('');

    prompt.override = flags;
    prompt.start();
    prompt.get(schema, (err, input) => {
        // Keep this conditional as the first line in this function.
        // Why? because you will get a js error if you try to set or use anything related to the input object.
        if (err) {
            prompt.stop();
            error(`${NAME} ${err.message}`);
            return;
        }

        // Reduce the input
        input = { ...flags, ...input };
        const params = CONFORM({ action, input, props });

        // Preflight
        const msg = PREFLIGHT({ action, params });

        const promise =
            action === 'scan'
                ? Promise.resolve(params)
                : CONFIRM({ props, params, msg });

        promise
            .then(params => {
                generator({ action, params, props }).then(success => {
                    console.log('');
                });
            })
            .catch(err => {
                prompt.stop();
                if (err) {
                    error(err);
                } else {
                    error(CANCELED.replace('ACTION', action));
                }
            });
    });
};

/**
 * COMMAND Function
 * @description Function that executes program.command()
 */
const COMMAND = ({ program, props }) =>
    program
        .command(NAME)
        .description(DESC)
        .action((action, opt) => ACTION({ action, opt, props }))
        .option(
            '-i, --id <zone>',
            'The plugin zone id. Used when the <action> is add, update, or remove.',
        )
        .option(
            '-d, --description <description>',
            'The description of the plugin zone. Used when the <action> is add or update.',
        )
        .option(
            '-N, --no-node [node]',
            'Excludes the `node_modules` directory when scanning the source code.',
        )
        .option('-C, --no-cache [cache]', 'Do not cache the --scan results.')
        .option(
            '-A, --no-activity [activity]',
            'Do not show the activity spinner.',
        )
        .option(
            '-S, --no-source [source]',
            'Exclude the `src` directory when scanning the source code.',
        )
        .on('--help', HELP);

/**
 * Module Constructor
 * @description Internal constructor of the module that is being exported.
 * @param program Class Commander.program reference.
 * @param props Object The CLI props passed from the calling class `arcli.js`.
 * @since 2.0.0
 */
module.exports = {
    ACTION,
    COMMAND,
    NAME,
};
