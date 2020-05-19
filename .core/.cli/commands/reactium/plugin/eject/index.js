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
 * @example $ arcli eject
 * @see https://www.npmjs.com/package/commander#command-specific-options
 * @since 2.0.0
 */
const NAME = 'plugin <eject>';

/**
 * DESC String
 * @description Constant defined as the command description. Value passed to
 * the commander.desc() function. This string is also used in the --help flag output.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const DESC =
    'Compile a runtime plugin to a UMD asset and eject the asset into a publishing directory.';

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
                        message: ' ',
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
const CONFORM = ({ input, props, params }) =>
    Object.keys(input).reduce((obj, key) => {
        let val = input[key];
        switch (key) {
            default:
                obj[key] = val;
                break;
        }
        return obj;
    }, params);

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
  $ arcli eject
`);

/**
 * PREFLIGHT Function
 */
const PREFLIGHT = ({ msg, params, props }) => {
    msg = msg || 'Preflight checklist:';

    message(msg);

    const { plugin, targetPath, targetLabel, offerBuild, assets } = params;

    console.log(chalk.white('Plugin:'), chalk.cyan(plugin));
    console.log(
        chalk.white('Running build:'),
        chalk.cyan(offerBuild ? 'Y' : 'N'),
    );
    if (assets && assets.length > 0) {
        console.log(chalk.white('Copying assets:'));
        assets.forEach(asset => console.log(chalk.white(`  - ${asset}`)));
    }
    console.log(chalk.white('Target path:'), chalk.cyan(targetPath));
    if (targetLabel)
        console.log(
            chalk.white('New target path label:'),
            chalk.cyan(targetLabel),
        );
};

const descriptionList = (list = []) => {
    return (
        list.reduce((description, plugin, index) => {
            description += `  ${chalk.cyan(index + 1)}: ${plugin}\n\r`;
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
                before: val => op.get(plugins, Number(val) - 1),
                conform: val => op.has(plugins, Number(val) - 1),
                default: 1,
            },
        },
    };
};

/**
 * SCHEMA Function
 * @description used to describe the input for the prompt function.
 * @see https://www.npmjs.com/package/prompt
 * @since 2.0.0
 */
const SCHEMA_CHOOSE_TARGET = ({ props, actiniumPlugins }) => {
    const pluginKeys = Object.keys(actiniumPlugins);

    const { cwd, prompt } = props;
    const schema = {
        properties: {
            targetPath: {
                description:
                    pluginKeys.length > 0
                        ? chalk.white(
                              'Choose target actinium plugin (select from below or type path to target directory):\n\r',
                          ) + descriptionList(pluginKeys)
                        : chalk.white('Target actinium plugin directory:'),
                required: true,
                message:
                    pluginKeys.length > 1
                        ? chalk.white(
                              `Select 1 to ${pluginKeys.length} or a valid path`,
                          )
                        : chalk.white('Select a valid path'),
                before: val => {
                    const selected = op.has(pluginKeys, Number(val) - 1);
                    if (selected)
                        return actiniumPlugins[
                            op.get(pluginKeys, Number(val) - 1)
                        ];

                    const potentialPath = path.resolve(path.relative(cwd, val));
                    if (fs.existsSync(potentialPath)) return potentialPath;
                },
                conform: val => {
                    const selected = op.has(pluginKeys, Number(val) - 1);
                    if (selected) return true;

                    const potentialPath = path.resolve(path.relative(cwd, val));
                    return fs.existsSync(potentialPath);
                },
            },
            offerLabel: {
                description: `${chalk.white(
                    'This path does not have a label, provide one?',
                )} ${chalk.cyan('(Y/N):')}`,
                type: 'string',
                required: true,
                pattern: /^y|n|Y|N/,
                message: ' ',
                before: val => {
                    return String(val).toUpperCase() === 'Y';
                },
                ask: () => {
                    const targetPath = op.get(
                        prompt.history('targetPath'),
                        'value',
                    );

                    return !Object.values(actiniumPlugins).includes(targetPath);
                },
            },
            targetLabel: {
                description: chalk.white('Label for target directory:'),
                type: 'string',
                required: true,
                pattern: /^[a-zA-Z_\-0-9]{4,}$/,
                message: chalk.white('Invalid label'),
                before: val => {
                    return `actinium-plugins.${slugify(String(val))}`;
                },
                ask: () => op.get(prompt.history('offerLabel'), 'value', false),
            },
        },
    };

    if (actiniumPlugins.length > 0)
        op.set(schema, 'properties.targetPath.default', 1);

    return schema;
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
    const plugins = globby(
        path
            .resolve(cwd, 'src/app/components/plugin-src/**/umd.js')
            .split(/[\\\/]/g)
            .join(path.posix.sep),
    ).map(mod => path.basename(path.dirname(mod)));

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

                params = CONFORM({ input, props, params });

                resolve();
            },
        );
    })
        .then(() => {
            const actiniumPlugins = op.get(config, 'actinium-plugins', {});
            return new Promise((resolve, reject) => {
                prompt.get(
                    SCHEMA_CHOOSE_TARGET({
                        props,
                        actiniumPlugins,
                    }),
                    (err, input = {}) => {
                        if (err) {
                            prompt.stop();
                            reject(`${NAME} ${err.message}`);
                            return;
                        }

                        params = CONFORM({ input, props, params });
                        if (op.has(params, 'targetLabel')) {
                            params.newConfig = { ...config };
                            op.set(
                                params.newConfig,
                                op.get(params, 'targetLabel'),
                                op.get(params, 'targetPath'),
                            );
                        }

                        resolve();
                    },
                );
            });
        })
        .then(() => {
            const { plugin } = params;
            const assets = globby([
                `${cwd}/public/assets/js/umd/${plugin}/${plugin}.js`,
                `${cwd}/public/assets/style/${plugin}-plugin.css`,
            ]);

            return new Promise((resolve, reject) => {
                prompt.get(
                    {
                        properties: {
                            offerBuild: {
                                description: `${
                                    assets.length < 1
                                        ? chalk.white(
                                              `No assets appear for plugin ${params.plugin}. Run build?`,
                                          )
                                        : chalk.white('Run build?')
                                } ${chalk.cyan('(Y/N):')}`,
                                type: 'string',
                                required: true,
                                pattern: /^y|n|Y|N/,
                                message: ' ',
                                before: val => {
                                    return String(val).toUpperCase() === 'Y';
                                },
                            },
                        },
                    },
                    (err, input = {}) => {
                        if (err) {
                            prompt.stop();
                            reject(`${NAME} ${err.message}`);
                            return;
                        }

                        params = CONFORM({ input, props, params });
                        const { offerBuild } = params;
                        if (assets.length < 1 && !offerBuild) {
                            reject('No assets to eject');
                            return;
                        } else {
                            params.assets = assets;
                        }

                        resolve();
                    },
                );
            });
        })
        .then(() => PREFLIGHT({ params, props }))
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
