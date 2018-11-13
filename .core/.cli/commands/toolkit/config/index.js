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
const manifest = require('../manifest');
const mod = path.dirname(require.main.filename);

const { error, message } = require(`${mod}/lib/messenger`);

const m = {};

/**
 * NAME String
 * @description Constant defined as the command name. Value passed to the commander.command() function.
 * @example $ arcli toolkit
 * @see https://www.npmjs.com/package/commander#command-specific-options
 * @since 2.0.0
 */
const NAME = 'toolkit';

/**
 * DESC String
 * @description Constant defined as the command description. Value passed to
 * the commander.desc() function. This string is also used in the --help flag output.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const DESC = 'Toolkit:  Set toolkit configuration values.';

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
const CONFIRM = ({ props, params }) => {
    const { prompt } = props;

    return new Promise((resolve, reject) => {
        prompt.get(
            {
                properties: {
                    confirmed: {
                        description: `${chalk.white('Proceed?')} ${chalk.cyan(
                            '(Y/N):'
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
            (error, input) => {
                let confirmed;

                try {
                    confirmed = input.confirmed;
                } catch (err) {
                    confirmed = false;
                }

                if (error || confirmed === false) {
                    reject(error);
                } else {
                    resolve(params);
                }
            }
        );
    });
};

/**
 * conform(input:Object) Function
 * @description Reduces the input object.
 * @param input Object The key value pairs to reduce.
 * @since 2.0.0
 */
const CONFORM = ({ input, props }) => {
    const { cwd } = props;

    let output = {};

    Object.entries(input).forEach(([key, val]) => {
        switch (key) {
            case 'ver':
                output['header.version'] = val;
                break;

            case 'logo':
            case 'title':
            case 'version':
                output[`header.${key}`] = val;
                break;

            default:
                output[key] = val;
                break;
        }
    });

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
    console.log(`  $ arcli toolkit --header 'Style Guide'`);
    console.log('');
    console.log(
        `  $ arcli toolkit --logo '/assets/images/atomic-reactor-logo.svg'`
    );
    console.log('');
    console.log(`  $ arcli toolkit --ver '2.1.1'`);
    console.log('');
};

/**
 * SCHEMA Function
 * @description used to describe the input for the prompt function.
 * @see https://www.npmjs.com/package/prompt
 * @since 2.0.0
 */
const SCHEMA = ({ props }) => {
    const { cwd, prompt } = props;

    const { logo, title, version } = op.get(m, 'header');

    return {
        properties: {
            logo: {
                description: chalk.white('Logo:'),
                default: logo,
            },
            title: {
                description: chalk.white('Title:'),
                default: title,
            },
            ver: {
                description: chalk.white('Version:'),
                default: version,
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

    Object.entries(manifest(props)).forEach(([key, value]) => {
        m[key] = value;
    });

    const { cwd, prompt } = props;

    const schema = SCHEMA({ props });

    const ovr = Object.keys(schema.properties).reduce((obj, key) => {
        let val = opt[key];
        val = typeof val === 'function' ? null : val;
        if (val) {
            obj[key] = val;
        }
        return obj;
    }, {});

    prompt.override = ovr;
    prompt.start();
    prompt.get(schema, (err, input) => {
        // Keep this conditional as the first line in this function.
        // Why? because you will get a js error if you try to set or use anything related to the input object.
        if (err) {
            prompt.stop();
            error(`${NAME} ${err.message}`);
            return;
        }

        const params = CONFORM({ input, props });

        message(`Toolkit config will be updated with the following options:`);
        const preflight = { ...params };

        console.log(
            prettier.format(JSON.stringify(preflight), {
                parser: 'json-stringify',
            })
        );

        CONFIRM({ props, params })
            .then(params => generator({ params, props }))
            .then(success => console.log(''))
            .catch(err => {
                prompt.stop();
                message(CANCELED);
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
        .action(opt => ACTION({ opt, props }))
        .option('-l, --logo [logo]', 'The toolkit logo path.')
        .option('-t, --title [title]', 'The toolkit title.')
        .option('-V, --ver [version]', 'The toolkit version.')
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
    CONFIRM,
    CONFORM,
    COMMAND,
    NAME,
};
