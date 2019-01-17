/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const fs = require('fs-extra');
const chalk = require('chalk');
const generator = require('./generator');
const prettier = require('prettier');
const path = require('path');
const op = require('object-path');
const mod = path.dirname(require.main.filename);
const { error, message } = require(`${mod}/lib/messenger`);

/**
 * NAME String
 * @description Constant defined as the command name. Value passed to the commander.command() function.
 * @example $ arcli server template <type>
 * @see https://www.npmjs.com/package/commander#command-specific-options
 * @since 2.0.0
 */
const NAME = 'server <action>';

/**
 * DESC String
 * @description Constant defined as the command description. Value passed to
 * the commander.desc() function. This string is also used in the --help flag output.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const DESC = 'Reactium: Create a custom server template.';

/**
 * CANCELED String
 * @description Message sent when the command is canceled
 * @since 2.0.0
 */
const CANCELED = 'Action canceled!';

/**
 * TYPES
 * @description types of server templates that can be created
 */
const TYPES = ['feo', 'ssr'];

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
const CONFORM = ({ input, props }) => {
    const output = Object.keys(input).reduce((obj, key) => {
        let val = input[key];
        switch (key) {
            case 'type':
                val = String(val).toLowerCase();
                val = TYPES.includes(val) ? val : 'all';
                obj[key] = val;
                break;

            default:
                obj[key] = val;
                break;
        }

        return obj;
    }, {});

    return output;
};

/**
 * HELP Function
 * @description Function called in the commander.on('--help', callback) callback.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const HELP = () =>
    console.log(`
Example:
  $ arcli server template

Exclude the front-end template:
  $ arcli server template --no-feo

Exclude the server side render template:
  $ arcli server template --no-ssr

Overwrite existing server templates
  $ arcli server template --overwrite
`);

/**
 * FLAGS
 * @description Array of flags passed from the commander options.
 * @since 2.0.18
 */
const FLAGS = ['feo', 'ssr', 'overwrite'];

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

const isTemplate = cwd => {
    const destFEO = fs.existsSync(
        path.normalize(`${cwd}/src/app/server/template/feo.js`),
    );
    const destSSR = fs.existsSync(
        path.normalize(`${cwd}/src/app/server/template/ssr.js`),
    );

    return destFEO || destSSR;
};

/**
 * SCHEMA Function
 * @description used to describe the input for the prompt function.
 * @see https://www.npmjs.com/package/prompt
 * @since 2.0.0
 */
const SCHEMA = ({ props }) => {
    const { cwd } = props;

    return {
        properties: {
            overwrite: {
                required: true,
                pattern: /^y|n|Y|N/,
                message: '',
                description: `${chalk.white(
                    'Overwrite existing template?',
                )} ${chalk.cyan('(Y/N):')}`,
                ask: () => isTemplate(cwd),
                before: val => Boolean(String(val).toUpperCase() === 'Y'),
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
const ACTION = ({ action, opt, props }) => {
    console.log('');

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

            const { feo, ssr } = params;

            if (!op.has(params, 'overwrite') || (!feo && !ssr)) {
                reject(CANCELED);
                return;
            }

            resolve(params);
        });
    })
        .then(() => {
            return CONFIRM({ props, params });
        })
        .then(() => {
            console.log('');
            return generator({ action, params, props });
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
        .action((action, opt) => ACTION({ action, opt, props }))
        .option('-F, --no-feo [feo]', 'Front-end template.')
        .option('-S, --no-ssr [ssr]', 'Server-side rendering template.')
        .option(
            '-o, --overwrite [overwrite]',
            'Overwrite existing template files.',
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
