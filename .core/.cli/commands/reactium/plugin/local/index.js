/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const chalk = require('chalk');
const prettier = require('prettier');
const path = require('path');
const op = require('object-path');
const mod = path.dirname(require.main.filename);
const { error, message } = require(`${mod}/lib/messenger`);
const GENERATOR = require('./generator');
const globby = require('globby').sync;
const fs = require('fs-extra');
const slugify = require('slugify');

/**
 * NAME String
 * @description Constant defined as the command name. Value passed to the commander.command() function.
 * @example $ arcli local
 * @see https://www.npmjs.com/package/commander#command-specific-options
 * @since 2.0.0
 */
const NAME = 'plugin <local>';

/**
 * DESC String
 * @description Constant defined as the command description. Value passed to
 * the commander.desc() function. This string is also used in the --help flag output.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const DESC = 'Toggle local development mode for a runtime plugin.';

/**
 * CANCELED String
 * @description Message sent when the command is canceled
 * @since 2.0.0
 */
const CANCELED = 'Action canceled!';

/**
 * HELP Function
 * @description Function called in the commander.on('--help', callback) callback.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const HELP = () =>
    console.log(`
Example:
  # Follow the prompts
  $ arcli local
`);

/**
 * PREFLIGHT Function
 */
const PREFLIGHT = ({ msg, params, props }) => {
    const { plugin } = params;

    msg =
        msg ||
        `${chalk.white('Toggle Local Development for Plugin:')} ${chalk.cyan(
            plugin.name,
        )} ${plugin.development ? chalk.cyan('off') : chalk.cyan('on')}`;

    message(msg);
};

const descriptionList = (list = []) => {
    return (
        list.reduce((description, plugin, index) => {
            description += `  ${chalk.cyan(index + 1)}: ${
                plugin.name
            } ${chalk.cyan(plugin.development ? '(on)' : '(off)')}\n\r`;
            return description;
        }, '') + '\n\r'
    );
};

/**
 * SCHEMA Function
 * @description used to describe the input for the prompt function.
 * @see https://www.npmjs.com/package/prompt
 * @since 2.0.0
 */
const SCHEMA_CHOOSE_PLUGIN = ({ props, plugins }) => {
    return {
        properties: {
            plugin: {
                description:
                    chalk.white('Choose plugin:\n\r') +
                    descriptionList(plugins),
                required: true,
                message:
                    plugins.length > 1
                        ? chalk.white(`Select 1 to ${plugins.length}`)
                        : chalk.white('1 is only option.'),
                conform: val => op.has(plugins, [Number(val) - 1]),
                default: 1,
            },
        },
    };
};

/**
 * ACTION Function
 * @description Function used as the commander.action() callback.
 * @see https://www.npmjs.com/package/commander
 * @param opt Object The commander options passed into the function.
 * @param props Object The CLI props passed from the calling class `arcli.js`.
 * @since 2.0.0
 */
const ACTION = ({ opt, props }) => {
    const { cwd, prompt, config } = props;
    const umds = globby(
        path
            .resolve(cwd, 'src/app/components/plugin-src/**/umd.js')
            .split(/[\\\/]/g)
            .join(path.posix.sep),
    );

    const plugins = umds.map(mod => {
        const dir = path.dirname(mod);
        const name = path.basename(dir);
        const confPath = path.resolve(dir, 'reactium-hooks.json');

        let development = false;
        if (fs.existsSync(confPath)) {
            try {
                development = op.get(
                    JSON.parse(fs.readFileSync(confPath, 'utf8')),
                    'development',
                    false,
                );
            } catch (err) {}
        }

        console.log({ name, dir, confPath, development });

        return {
            name,
            dir,
            confPath,
            development,
        };
    });

    prompt.start();

    let params = {};

    return new Promise((resolve, reject) => {
        if (plugins.length < 1) {
            message(
                chalk.magenta(
                    'No plugins found in src/app/components/plugin-src.',
                    chalk.white(
                        `Use ${chalk.cyan(
                            '`arcli plugin module`',
                        )} to create one.`,
                    ),
                ),
            );
            reject();
            return;
        }

        prompt.get(
            SCHEMA_CHOOSE_PLUGIN({ props, plugins }),
            (err, input = {}) => {
                if (err) {
                    prompt.stop();
                    reject(`${NAME} ${err.message}`);
                    return;
                }

                let pluginIndex = Number(op.get(input, 'plugin', 1)) - 1;
                pluginIndex = Math.max(
                    0,
                    Math.min(pluginIndex, plugins.length - 1),
                );

                op.set(params, 'plugins', plugins);
                op.set(params, 'plugin', op.get(plugins, pluginIndex));

                resolve();
            },
        );
    })
        .then(() => PREFLIGHT({ params, props }))
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
        .action(opt => ACTION({ opt, props }))
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
