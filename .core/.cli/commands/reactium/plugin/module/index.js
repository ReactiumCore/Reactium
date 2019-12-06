/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const chalk = require('chalk');
const prettier = require('prettier');
const path = require('path');
const fs = require('fs-extra');
const op = require('object-path');
const mod = path.dirname(require.main.filename);
const { error, message } = require(`${mod}/lib/messenger`);
const GENERATOR = require('./generator');
const slugify = require('slugify');

/**
 * NAME String
 * @description Constant defined as the command name. Value passed to the commander.command() function.
 * @example $ arcli module
 * @see https://www.npmjs.com/package/commander#command-specific-options
 * @since 2.0.0
 */
const NAME = 'plugin <module>';

/**
 * DESC String
 * @description Constant defined as the command description. Value passed to
 * the commander.desc() function. This string is also used in the --help flag output.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const DESC = 'Create exportable plugin module.';

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
    const { prompt, cwd } = props;
    const { plugin } = params;

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
    Object.keys(input).reduce((obj, key) => {
        let val = input[key];
        switch (key) {
            case 'overwrite':
                if (String(val).toUpperCase() === 'Y' || val === true)
                    obj[key] = true;
                if (String(val).toUpperCase() === 'N' || val === false)
                    obj[key] = false;
                break;
            default:
                obj[key] = val;
                break;
        }
        return obj;
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
  # results in plugin named my-neato-functions
  $ arcli module --name "My Neato Functions Plugin"
`);

/**
 * FLAGS
 * @description Array of flags passed from the commander options.
 * @since 2.0.18
 */
const FLAGS = ['plugin', 'overwrite'];

/**
 * FLAGS_TO_PARAMS Function
 * @description Create an object used by the prompt.override property.
 * @since 2.0.18
 */
const FLAGS_TO_PARAMS = ({ opt = {} }) =>
    FLAGS.reduce((obj, key) => {
        let val = opt[key];
        val = typeof val === 'function' ? undefined : val;

        if (key === 'plugin') obj[key] = nameToPluginName(val);
        if (key === 'overwrite' && val === true) obj.overwrite = true;

        return obj;
    }, {});

/**
 * PREFLIGHT Function
 */
const PREFLIGHT = ({ msg, params, props }) => {
    msg = msg || 'Preflight checklist:';

    message(msg);

    const { prompt, cwd } = props;
    const { plugin } = params;

    message(
        `Reactium Plugin module will be created at ${chalk.cyan(
            path.relative(cwd, getPluginPath(plugin, cwd)),
        )}`,
    );
};

const nameToPluginName = (name = '') => {
    // remove redundant plugin word from plugin
    const lower = String(name)
        .toLowerCase()
        .replace('plugin', '');
    return slugify(lower);
};

const getPluginPath = (name, cwd) =>
    path.resolve(cwd, 'src/app/components/plugin-src', name);
const pluginPathExists = (name, cwd) => {
    const pluginPath = getPluginPath(name, cwd);
    return fs.existsSync(pluginPath);
};

/**
 * SCHEMA Function
 * @description used to describe the input for the prompt function.
 * @see https://www.npmjs.com/package/prompt
 * @since 2.0.0
 */
const SCHEMA = ({ props }) => {
    const { cwd, prompt } = props;
    return {
        properties: {
            plugin: {
                description: 'Plugin name:',
                required: true,
                before: nameToPluginName,
                message: chalk.cyan(
                    'Plugin name invalid. Must be at least 4 characters, and not include the word "plugin"',
                ),
                conform: name => {
                    const check = nameToPluginName(name);
                    return String(check).length >= 4;
                },
            },
            overwrite: {
                pattern: /^y|n|Y|N/,
                default: 'N',
                description: 'Plugin exists. Overwrite? (y/N):',
                ask: () => {
                    const name = op.get(
                        prompt.history('plugin'),
                        'value',
                        op.get(prompt, 'override.plugin'),
                    );
                    return (
                        pluginPathExists(name, cwd) &&
                        !op.get(prompt, 'override.overwrite', false)
                    );
                },
                message: ` `,
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
    const { cwd, prompt } = props;
    const schema = SCHEMA({ props });
    const ovr = FLAGS_TO_PARAMS({ opt });

    prompt.override = ovr;
    prompt.start();

    let params = {};

    return new Promise((resolve, reject) => {
        prompt.get(schema, (err, input = {}) => {
            if (err) {
                prompt.stop();
                reject(`${NAME} ${err.message}`);
                return;
            }

            input = { ...ovr, ...input };
            params = CONFORM({ input, props });

            const { plugin, overwrite } = params;
            // Cancel if existing and not overwriting
            if (pluginPathExists(plugin, cwd) && !overwrite) {
                reject();
                return;
            }

            PREFLIGHT({ params, props });

            resolve();
        });
    })
        .then(() => CONFIRM({ props, params }))
        .then(() => GENERATOR({ params, props }))
        .then(() => prompt.stop())
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
        .action((action, opt) => ACTION({ opt, props }))
        .option(
            '-o, --overwrite [overwrite]',
            'Allow overwrite of existing plugin.',
        )
        .option('-p, --plugin [plugin]', 'Reactium plugin module name.')
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
    ID: NAME,
};
