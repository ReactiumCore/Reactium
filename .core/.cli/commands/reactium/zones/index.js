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

const NAME = 'zones <action>';

const DESC = 'Reactium: Manage the current project Plugin Zones';

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

const FLAGS = [
    'id',
    'description',
    'node',
    'cache',
    'activity',
    'source',
    'zone',
    'json',
];

const FLAGS_TO_PARAMS = ({ opt = {} }) =>
    FLAGS.reduce((obj, key) => {
        let val = opt[key];
        val = typeof val === 'function' ? undefined : val;

        if (val) {
            obj[key] = val;
        }

        return obj;
    }, {});

const CANCELED = 'zones ACTION canceled';

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

    if (action === 'list') {
        delete output.activity;
    }

    return output;
};

const HELP = () =>
    console.log(`

Available <action> values:
${chalk.cyan('list')} | ${chalk.cyan('scan')} | ${chalk.cyan(
        'add',
    )} | ${chalk.cyan('update')} | ${chalk.cyan('remove')} | ${chalk.cyan(
        'purge',
    )}

<${chalk.cyan('list')}>
  Output the plugin zones:
    $ arcli zones ${chalk.cyan('list')}

  Output the plugin zones as JSON
    $ arcli zones ${chalk.cyan('list')} --json
    $ arcli zones ${chalk.cyan('list')} -j

    ${chalk.magenta(
        '* Note:',
    )} if a zone is found in more than one location, the first occurance is added to the manifest.

<${chalk.cyan('scan')}>
  Scan the '~/src' directory only, omiting the 'node_modules' directory:
    $ arcli zones ${chalk.cyan('scan')} --no-node
    $ arcli zones ${chalk.cyan('scan')} -N

    ${chalk.magenta(
        '* Note:',
    )} if a zone already exists in the manifest, it is skipped.

<${chalk.cyan('add')}> | <${chalk.cyan('update')}>
  Add a plugin zone to the manifest:
    $ arcli zones ${chalk.cyan(
        'add',
    )} --id "my-plugin-zone" --description "My awesome plugins go here!"
    $ arcli zones ${chalk.cyan(
        'add',
    )} -i "my-plugin-zone" -d "My awesome plugins go here!"

    ${chalk.magenta(
        '* Note:',
    )} if a zone already exists in the manifest, it will be updated.

<${chalk.cyan('remove')}>
  Remove a plugin zone from the manifest:
    $ arcli zones ${chalk.cyan('remove')} --id "my-plugin-zone"

<${chalk.cyan('purge')}>
  Clear all entries from the plugin zone manifest:
    $ arcli zones ${chalk.cyan('purge')}

    ${chalk.magenta(
        '* Note:',
    )} Purging can not be undone. You can run ${chalk.cyan(
        '$ arcli zones scan',
    )} to regenerate the default manifest.

`);

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
                    if (action === 'update') {
                        return true;
                    }

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
                    if (action === 'update') {
                        return true;
                    }

                    if (!op.has(prompt, 'override.description')) {
                        return ['add', 'update'].includes(action);
                    } else {
                        return false;
                    }
                },
            },
        },
    };

    return output;
};

const SCHEMA_SELECT = ({ action, opt, props }) => {
    const { prompt } = props;
    const zones = ZONE_LIST();
    return {
        properties: {
            id: {
                description: `${chalk.white('Zone:')}\n\t ${zones.join(
                    '\n\t ',
                )}\n   ${chalk.white('Select:')}`,
                type: 'string',
                required: true,
                message: ' select a zone',
                ask: () => {
                    return !op.has(prompt, 'override.id');
                },
                before: val => {
                    val = val.replace(/[^\w-_]/g, '');
                    return !isNaN(val) && val > zones.length
                        ? null
                        : GET_ZONE(val) || val;
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
                '\n',
                'A plugin zone will be created with the following options:',
            );
            console.log('');
            console.log(
                prettier.format(
                    JSON.stringify(_.pick(params, 'id', 'description')),
                    {
                        parser: 'json-stringify',
                    },
                ),
            );
            break;

        case 'update':
            console.log(
                '\n',
                `The plugin zone ${chalk.cyan(
                    op.get(params, 'id'),
                )} will be updated with the following options:`,
            );
            console.log('');
            console.log(
                prettier.format(
                    JSON.stringify(_.pick(params, 'id', 'description')),
                    {
                        parser: 'json-stringify',
                    },
                ),
            );
            break;

        case 'remove':
            msg = `Are you sure you want to remove the ${chalk.cyan(
                op.get(params, 'id'),
            )} zone?`;
            break;

        case 'purge':
            msg = `Purging can not be undone. Are you sure?`;
            break;
    }

    return msg;
};

const ACTION = ({ action, opt, props, zone }) => {
    const id = op.get(opt, 'id');

    if (['update', 'remove'].includes(action) && !id) {
        ACTION_SELECT({ action, opt, props });
        return;
    }

    if (id && !op.has(M, id)) {
        action = 'add';
    }

    const { prompt } = props;

    const flags = FLAGS_TO_PARAMS({ opt });

    if (action !== 'update') {
        prompt.override = flags;
    } else if (id && !zone) {
        zone = { ...op.get(M, GET_ZONE(id), {}), id };
    }

    let schema;

    switch (action) {
        default:
            schema = SCHEMA({ action, props, zone });
    }

    console.log('');
    prompt.start();
    prompt.get(schema, (err, input) => {
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

        const promise = ['scan', 'list'].includes(action)
            ? Promise.resolve(params)
            : CONFIRM({ props, params, msg });

        promise
            .then(params => generator({ action, params, props }))
            .then(success => console.log(''))
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

const ACTION_SELECT = ({ action, opt, props }) => {
    if (Object.keys(M).length < 1) {
        return error(
            `no zones found.\n\nRun:\n${chalk.cyan(
                '  $ arcli zones scan',
            )}\n or:\n${chalk.cyan('  $ arcli zones add')}`,
        );
    }

    const { prompt } = props;
    const flags = FLAGS_TO_PARAMS({ opt });

    prompt.override = flags;
    const schema = SCHEMA_SELECT({ action, opt, props });

    prompt.start();
    prompt.get(schema, (err, input) => {
        if (err) {
            prompt.stop();
            error(`${NAME} ${err.message}`);
            return;
        }

        const zone = {
            id: input.id,
            description: op.get(M, `${input.id}.description`),
        };

        opt = { ...opt, ...input };

        ACTION({ action, opt, props, zone });
    });
};

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
            '-j, --json [json]',
            'Output the plugin zones as a JSON object. Used when calling the <list> action.',
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
