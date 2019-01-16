/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const chalk = require('chalk');
const generator = require('./generator');
const prettier = require('prettier');
const path = require('path');
const op = require('object-path');
const mod = path.dirname(require.main.filename);
const { error, message } = require(`${mod}/lib/messenger`);

const formatDestination = (val, props) => {
    const { cwd } = props;

    val = path.normalize(val);
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

/**
 * NAME String
 * @description Constant defined as the command name. Value passed to the commander.command() function.
 * @example $ arcli library
 * @see https://www.npmjs.com/package/commander#command-specific-options
 * @since 2.0.0
 */
const NAME = 'library';

/**
 * DESC String
 * @description Constant defined as the command description. Value passed to
 * the commander.desc() function. This string is also used in the --help flag output.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const DESC = 'Reactium: Convert a component into a library component.';

/**
 * CANCELED String
 * @description Message sent when the command is canceled
 * @since 2.0.0
 */
const CANCELED = 'Action canceled!';

/**
 * confirm({ props:Object, params:Object }) Function
 * @description Prompts the user to confirm the operation
 * @since 2.0.0
 */
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
                            return String(val).toUpperCase() === 'Y';
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

/**
 * conform(input:Object) Function
 * @description Reduces the input object.
 * @param input Object The key value pairs to reduce.
 * @since 2.0.0
 */
const CONFORM = ({ input, props }) =>
    Object.keys(input).reduce((output, key) => {
        let val = input[key];
        switch (key) {
            case 'destination':
                output[key] = formatDestination(val, props);
                break;

            default:
                output[key] = val;
                break;
        }

        return output;
    }, {});

/**
 * HELP Function
 * @description Function called in the commander.on('--help', callback) callback.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const HELP = () =>
    console.log(`
Example:
  $ arcli library -d components/MyComponent
  $ arcli library -d common-ui/MyCommonUiComponent

When specifying the destination [-d, --destination] the following shortcuts are available:
  ${chalk.cyan('components/')}  The /.src/app/components directory.
  ${chalk.cyan('common-ui/')}   The /.src/app/components/common-ui directory.
`);

/**
 * FLAGS
 * @description Array of flags passed from the commander options.
 * @since 2.0.18
 */
const FLAGS = ['component', 'destination', 'from', 'overwrite'];

/**
 * FLAGS_TO_PARAMS Function
 * @description Create an object used by the prompt.override property.
 * @since 2.0.18
 */
const FLAGS_TO_PARAMS = ({ opt = {} }) =>
    FLAGS.reduce((obj, key) => {
        let val = opt[key];
        val = typeof val === 'function' ? undefined : val;

        if (val) {
            obj[key] = val;
        }

        return obj;
    }, {});

/**
 * PREFLIGHT Function
 */
const PREFLIGHT = ({ msg, params, props }) => {
    msg =
        msg ||
        `A new ${chalk.cyan(
            'library.js',
        )} file will be generated with the following options:`;

    message(msg);

    // Transform the preflight object instead of the params object
    const preflight = { ...params };

    console.log(
        prettier.format(JSON.stringify(preflight), {
            parser: 'json-stringify',
        }),
    );
};

/**
 * SCHEMA Function
 * @description used to describe the input for the prompt function.
 * @see https://www.npmjs.com/package/prompt
 * @since 2.0.0
 */
const SCHEMA = ({ props }) => {
    return {
        properties: {
            destination: {
                description: chalk.white('Destination:'),
                message: `Enter the ${chalk.cyan('Destination')}`,
                required: true,
            },
            component: {
                description: chalk.white('Component:'),
                message: `Enter the ${chalk.cyan('Component')} name`,
                required: true,
            },
            from: {
                description: chalk.white('Import from:'),
                default: './index',
            },
        },
    };
};

/**
 * ACTION Function
 * @description Function used as the commander.action() callback.
 * @see https://www.npmjs.com/package/commander
 * @param opt Object The commander options passed into the function.
 * @param props Object The CLI props passed from the calling class `orcli.js`.
 * @since 2.0.0
 */
const ACTION = ({ opt, props }) => {
    console.log('');

    const { cwd, prompt } = props;
    const schema = SCHEMA({ props });
    const ovr = FLAGS_TO_PARAMS({ opt });

    if (op.has(opt, 'destination') && !op.has(opt, 'component')) {
        if (String(opt.destination).split('/').length > 1) {
            const comp = String(opt.destination)
                .split('/')
                .pop();
            if (comp) {
                ovr['component'] = comp;
            }
        }
    }

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

/**
 * COMMAND Function
 * @description Function that executes program.command()
 */
const COMMAND = ({ program, props }) =>
    program
        .command(NAME)
        .description(DESC)
        .action(opt => ACTION({ opt, props }))
        .option('-d, --destination [destination]', 'The component directory.')
        .option('-c, --component [component]', 'The component name.')
        .option(
            '-o, --overwrite [overwrite]',
            'Overwrite existing library file.',
        )
        .option(
            '-f, --from [from]',
            `The component import path relative to the ${chalk.cyan(
                'library.js',
            )} file. Default: ${chalk.cyan('./index')}`,
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
    COMMAND,
    NAME,
};
