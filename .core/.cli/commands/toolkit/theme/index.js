/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const chalk = require('chalk');
const generator = require('./generator');
const prettier = require('prettier');
const path = require('path');
const mod = path.dirname(require.main.filename);
const listItem = require(`${mod}/lib/listItem`);
const manifest = require('../manifest');
const _ = require('underscore');
const op = require('object-path');

const m = {};

const { error, message } = require(`${mod}/lib/messenger`);

const { formatID } = require('../element');

const formatMenuOrder = val => {
    if (isNaN(val)) {
        return null;
    }
    return Number(String(val).replace(/\D/gi, ''));
};

const formatStyleSheet = ({ val, props }) => {
    const { cwd } = props;

    val = val.replace(/^style\//gi, path.normalize(`${cwd}/src/assets/style/`));
    val = val.replace(/^cwd/gi, cwd);
    return val;
};

const actionBefore = ({ val, actions, defaultAction = 'create' }) => {
    if (!isNaN(val)) {
        val = Number(String(val)) - 1;

        if (val >= actions.length || val < 0) {
            return defaultAction;
        } else {
            return actions[val];
        }
    } else {
        return defaultAction;
    }
};

const themeBefore = ({ val, themes }) => {
    let theme = {};

    if (isNaN(val) && val !== '0') {
        val = _.findIndex(themes, { name: val });
        if (val < 0) {
            return;
        }

        theme = themes[val];
    } else {
        val = Number(val) - 1;
        theme = themes[val];
    }

    return op.get(theme, 'name');
};

const mapOverrides = ({ keys, opt }) => {
    return keys.reduce((obj, key) => {
        let val = opt[key];
        val = typeof val === 'function' ? null : val;
        val = val === 0 ? '0' : val;
        if (val) {
            obj[key] = val;
        }
        return obj;
    }, {});
};

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

/**
 * NAME String
 * @description Constant defined as the command name. Value passed to the commander.command() function.
 * @example $ arcli theme
 * @see https://www.npmjs.com/package/commander#command-specific-options
 * @since 2.0.0
 */
const NAME = 'theme [action]';

/**
 * DESC String
 * @description Constant defined as the command description. Value passed to
 * the commander.desc() function. This string is also used in the --help flag output.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const DESC = 'Toolkit:  Create/Update/Remove a toolkit theme.';

/**
 * CANCELED String
 * @description Message sent when the command is canceled
 * @since 2.0.0
 */
const CANCELED = 'Theme action canceled!';

/**
 * confirm({ props:Object, params:Object }) Function
 * @description Prompts the user to confirm the operation
 * @since 2.0.0
 */
const CONFIRM = ({ props, params, msg }) => {
    const { prompt } = props;

    if (!msg) {
        msg = `${chalk.white('Proceed?')} ${chalk.cyan('(Y/N):')}`;
    }

    return new Promise((resolve, reject) => {
        prompt.get(
            {
                properties: {
                    confirmed: {
                        description: msg,
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
    const themes = op.get(m, 'themes', []);

    let output = {};

    Object.entries(input).forEach(([key, val]) => {
        switch (key) {
            case 'active':
                val = val === 'n' ? false : val;
                output[key] = val;
                break;

            case 'stylesheet':
                val = formatStyleSheet({ val, props });
                output[key] = val;
                break;

            case 'menuOrder':
                val = formatMenuOrder(val);

                if ((val && !isNaN(val)) || val === '0') {
                    val = Number(val);
                    val = Math.max(0, val);
                    val = Math.min(themes.length, val);

                    if (val < themes.length) {
                        output[key] = val;
                    }
                }

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
    console.log('Usage:');
    console.log('');
    console.log('  <create>');
    console.log(
        '  Create a new theme named My Theme with a top level stylesheet which will be compiled to ~/public/assets/style/my-theme.css'
    );
    console.log(
        `  $ arcli theme create --name 'My Theme' --stylesheet 'cwd/src/assets/styles/my-theme.scss' --active`
    );
    console.log('');
    console.log('  <update>');
    console.log(
        '  Rename theme and stylesheet, then move it to 2nd menu index position and deactivate it.'
    );
    console.log(
        `  $ arcli theme update --name 'My Theme' --newName 'Your Theme' --stylesheet 'cwd/src/assets/styles/your-theme.scss' --menu-order 2 --inactive`
    );
    console.log('');
    console.log('  <remove>');
    console.log(`  $ arcli theme remove --name 'My Theme'`);
    console.log('');
};

/**
 * SCHEMA Function
 * @description used to describe the input for the prompt function.
 * @see https://www.npmjs.com/package/prompt
 * @since 2.0.0
 */
const SCHEMA_ACTION = ({ props }) => {
    const actions = ['create', 'update', 'remove'];
    const actionList = actions
        .map((item, index) =>
            listItem({
                item,
                index,
                padding: String(actions.length).length,
            })
        )
        .join('');

    return {
        properties: {
            action: {
                required: true,
                message: 'Select an action.',
                description: `${chalk.white(
                    'Action:'
                )} ${actionList}\n    ${chalk.white('Select:')}`,
                before: val => actionBefore({ val, actions }),
            },
        },
    };
};

const SCHEMA_SELECT = ({ props }) => {
    const themes = op.get(m, 'themes', []);

    const themeList = _.pluck(themes, 'name')
        .map((item, index) =>
            listItem({
                item,
                index,
                padding: String(themes.length).length,
            })
        )
        .join('');

    return {
        properties: {
            name: {
                required: true,
                message: 'Select the theme.',
                description: `${chalk.white(
                    'Theme:'
                )} ${themeList}\n    ${chalk.white('Select:')}`,
                before: val => themeBefore({ val, themes }),
            },
        },
    };
};

const SCHEMA_NAME = ({ props }) => {
    const { prompt } = props;
    const themes = op.get(m, 'themes', []);
    const names = _.pluck(themes, 'name')
        .join(',')
        .toLowerCase()
        .split(',');

    return {
        properties: {
            name: {
                description: chalk.white('Theme Name:'),
                message: chalk.white('Enter theme name'),
                required: true,
            },
            overwrite: {
                required: true,
                pattern: /^y|n|Y|N/,
                message: '',
                description: `${chalk.white(
                    'Overwrite existing theme?'
                )} ${chalk.cyan('(Y/N):')}`,
                ask: () => {
                    try {
                        let name =
                            prompt.override['name'] ||
                            prompt.history('name').value;
                        name = name.toLowerCase();
                        return names.includes(name);
                    } catch (err) {
                        return false;
                    }
                },
                before: val => {
                    return String(val).toLowerCase() === 'y';
                },
            },
        },
    };
};

const SCHEMA_CREATE = ({ props, params }) => {
    const { cwd, prompt } = props;
    const { name } = params;

    const themes = op.get(m, 'themes', []);
    const canOverwrite = overwritable(prompt);

    const ID = name ? formatID(name) : 'default';

    return {
        properties: {
            stylesheet: {
                description: chalk.white('Stylesheet:'),
                ask: () => canOverwrite,
                default: `style/${ID}.scss`,
            },
            menuOrder: {
                description: `${chalk.white('Menu Order')} ${chalk.cyan(
                    `[0-${themes.length}]:`
                )}`,
                ask: () => {
                    return canOverwrite && themes.length > 0;
                },
                before: val => formatMenuOrder(val),
            },
            active: {
                description: `${chalk.white('Selected?')} ${chalk.cyan(
                    '(Y/N):'
                )}`,
                pattern: /^y|n|Y|N/,
                message: ` `,
                ask: () => {
                    return canOverwrite && prompt.override['inactive'] !== true;
                },
                default: 'n',
                before: val => {
                    return String(val).toLowerCase() === 'y';
                },
            },
        },
    };
};

const SCHEMA_UPDATE = ({ props, params }) => {
    const { cwd, prompt } = props;
    const { name } = params;

    const themes = op.get(m, 'themes', []);
    const menuOrder = _.findIndex(themes, { name });
    const theme = themes[menuOrder] || {};

    const { css = null, selected = null } = theme;

    return {
        properties: {
            newName: {
                description: chalk.white('Name:'),
                default: name,
            },
            stylesheet: {
                description: chalk.white('Stylesheet:'),
                default: css,
            },
            menuOrder: {
                description: `${chalk.white('Menu Order')} ${chalk.cyan(
                    `[0-${themes.length}]:`
                )}`,
                default: String(menuOrder),
                before: val => formatMenuOrder(val),
            },
            active: {
                description: `${chalk.white('Selected?')} ${chalk.cyan(
                    '(Y/N):'
                )}`,
                pattern: /^y|n|Y|N/,
                message: ` `,
                default: selected === true ? 'y' : 'n',
                before: val => {
                    return String(val).toLowerCase() === 'y';
                },
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
    Object.entries(manifest(props)).forEach(([key, value]) => {
        m[key] = value;
    });

    if (!action) {
        const { prompt } = props;
        prompt.start();
        prompt.get(SCHEMA_ACTION({ props }), (err, input) => {
            if (!err) {
                const { action } = input;
                ACTION({ action, opt, props });
            } else {
                prompt.stop();
            }
        });
    } else {
        action = action.toLowerCase();
        switch (action) {
            case 'create':
                ACTION_CREATE({ opt, props });
                break;

            case 'update':
                ACTION_UPDATE({ opt, props });
                break;

            case 'remove':
                ACTION_REMOVE({ opt, props });
                break;
        }
    }
};

const ACTION_CREATE = ({ opt, props }) => {
    console.log('');

    const { cwd, prompt } = props;

    const { inactive, menuOrder, name, overwrite } = opt;

    let schema = SCHEMA_NAME({ props });
    let schemaCreate = SCHEMA_CREATE({ props, params: opt });

    const ovr = {
        ...mapOverrides({ keys: Object.keys(schema.properties), opt }),
        ...mapOverrides({ keys: Object.keys(schemaCreate.properties), opt }),
    };

    if (menuOrder) {
        ovr['menuOrder'] = String(formatMenuOrder(menuOrder));
    }

    if (inactive === true) {
        ovr['inactive'] = true;
        ovr['active'] = false;
    }

    prompt.override = ovr;
    prompt.start();

    const act = new Promise((resolve, reject) => {
        prompt.get(schema, (err, input) => {
            // Keep this conditional as the first line in this function.
            // Why? because you will get a js error if you try to set or use anything related to the input object.
            if (err) {
                prompt.stop();
                reject(err);
                return;
            }

            let params = CONFORM({ input, props });
            const { overwrite } = params;

            // Exit if overwrite or confirm !== true
            if (typeof overwrite === 'boolean' && !overwrite) {
                prompt.stop();
                reject({ message: CANCELED });
                return;
            }

            resolve(params);
        });
    })
        .then(params => {
            return new Promise((resolve, reject) => {
                schemaCreate = SCHEMA_CREATE({ params, props });

                prompt.get(schemaCreate, (err, input) => {
                    if (err) {
                        prompt.stop();
                        reject(err);
                        return;
                    }
                    resolve({ ...params, ...input });
                });
            });
        })
        .then(input => {
            let params = CONFORM({ input, props });

            message(`A new theme will be created with the following options:`);
            const preflight = { ...params };
            preflight['menuOrder'] = Number(input['menuOrder']);

            console.log(
                prettier.format(JSON.stringify(preflight), {
                    parser: 'json-stringify',
                })
            );

            return CONFIRM({ props, params });
        })
        .then(params => {
            let { menuOrder, name, overwrite } = params;

            const reducedParams = {
                menuOrder,
                name: params.name,
                css: path.normalize(
                    params.stylesheet
                        .replace(`${cwd}/src`, '')
                        .replace('.scss', '.css')
                ),
            };

            if (params.active === true) {
                reducedParams['selected'] = true;
            }

            const action = overwrite === true ? 'update' : 'create';

            if (action === 'update') {
                reducedParams['newName'] = name;
                const themes = op.get(m, 'themes', []);

                if (!menuOrder && menuOrder !== 0) {
                    menuOrder = _.findIndex(themes, { name });
                    reducedParams['menuOrder'] = menuOrder;
                }
            }

            generator({ action, params: reducedParams, props }).then(
                success => {
                    console.log('');
                }
            );
        })
        .catch(err => {
            if (err) {
                error(`${NAME} ${err.message}`);
            }
        });
};

const ACTION_UPDATE = ({ opt, props }) => {
    console.log('');

    const { cwd, prompt } = props;

    const { inactive, menuOrder, name, overwrite } = opt;

    let schema = SCHEMA_SELECT({ props });
    let schemaUpdate = SCHEMA_UPDATE({ props, params: opt });

    const ovr = {
        ...mapOverrides({ keys: Object.keys(schema.properties), opt }),
        ...mapOverrides({ keys: Object.keys(schemaUpdate.properties), opt }),
    };

    if (menuOrder) {
        ovr['menuOrder'] = String(formatMenuOrder(menuOrder));
    }

    if (inactive === true) {
        ovr['inactive'] = true;
        ovr['active'] = false;
    }

    prompt.override = ovr;
    prompt.start();

    const act = new Promise((resolve, reject) => {
        prompt.get(schema, (err, input) => {
            // Keep this conditional as the first line in this function.
            // Why? because you will get a js error if you try to set or use anything related to the input object.
            if (err) {
                prompt.stop();
                reject(err);
                return;
            }

            let params = CONFORM({ input, props });
            const { overwrite } = params;

            // Exit if overwrite or confirm !== true
            if (typeof overwrite === 'boolean' && !overwrite) {
                prompt.stop();
                reject({ message: CANCELED });
                return;
            }

            resolve(params);
        });
    })
        .then(params => {
            return new Promise((resolve, reject) => {
                schemaUpdate = SCHEMA_UPDATE({ params, props });

                prompt.get(schemaUpdate, (err, input) => {
                    if (err) {
                        prompt.stop();
                        reject(err);
                        return;
                    }
                    resolve({ ...params, ...input });
                });
            });
        })
        .then(input => {
            let params = CONFORM({ input, props });

            message(
                `The ${
                    params.name
                } theme will be updated with the following options:`
            );
            const preflight = { ...params };
            preflight['menuOrder'] = Number(input['menuOrder']);

            console.log(
                prettier.format(JSON.stringify(preflight), {
                    parser: 'json-stringify',
                })
            );

            return CONFIRM({ props, params });
        })
        .then(params => {
            let { menuOrder, name, overwrite } = params;

            const reducedParams = {
                menuOrder,
                name: params.name,
                newName: params.newName,
                css: path.normalize(
                    params.stylesheet
                        .replace(`${cwd}/src`, '')
                        .replace('.scss', '.css')
                ),
            };

            if (params.active === true) {
                reducedParams['selected'] = true;
            }

            generator({ action: 'update', params: reducedParams, props }).then(
                success => {
                    console.log('');
                }
            );
        })
        .catch(err => {
            if (err) {
                error(`${NAME} ${err.message}`);
            }
        });
};

const ACTION_REMOVE = ({ opt, props }) => {
    console.log('');

    const { cwd, prompt } = props;

    let schema = SCHEMA_SELECT({ props });

    prompt.override = mapOverrides({
        keys: Object.keys(schema.properties),
        opt,
    });
    prompt.start();

    const act = new Promise((resolve, reject) => {
        prompt.get(schema, (err, params) => {
            // Keep this conditional as the first line in this function.
            // Why? because you will get a js error if you try to set or use anything related to the input object.
            if (err) {
                prompt.stop();
                reject(err.message);
                return;
            } else {
                resolve(params);
            }
        });
    })
        .then(params =>
            CONFIRM({
                params,
                props,
                msg: `${chalk.white('Are you sure?')} ${chalk.cyan('(Y/N):')}`,
            })
        )
        .then(params => generator({ action: 'remove', params, props }))
        .then(() => console.log(''))
        .catch(err => error(err.message));
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
        .option('-n, --name [name]', 'Theme Name.')
        .option('-s, --stylesheet [stylesheet]', 'Theme stylesheet.')
        .option('-a, --active [active]', 'Activate the theme.')
        .option('-i, --inactive [inactive]', 'Deactivate the theme.')
        .option('-m, --menu-order [menuOrder]', 'Theme menu order index.')
        .option('-N, --new-name [newName]', 'Rename to.')
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
