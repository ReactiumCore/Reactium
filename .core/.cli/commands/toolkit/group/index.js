/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const chalk = require('chalk');
const prettier = require('prettier');
const path = require('path');
const op = require('object-path');
const generator = require('./generator');
const manifest = require('../manifest');
const mod = path.dirname(require.main.filename);
const pad = require(`${mod}/lib/pad`);
const listItem = require(`${mod}/lib/listItem`);
const { error, message } = require(`${mod}/lib/messenger`);

const m = {};

const { formatName, formatRoute } = require('../../reactium/component');

const { formatID, formatMenuOrder, mapOverrides } = require('../element');

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

const groupBefore = ({ val, groups, defaultGroup = 'uncategorized' }) => {
    if (!isNaN(val)) {
        val = Number(String(val)) - 1;
        return groups[val];
    } else {
        return formatID(val);
    }
};

const getGroups = ({ props }) => {
    return Object.keys(m.menu);
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
 * @example $ arcli group
 * @see https://www.npmjs.com/package/commander#command-specific-options
 * @since 2.0.0
 */
const NAME = 'group [action]';

/**
 * DESC String
 * @description Constant defined as the command description. Value passed to
 * the commander.desc() function. This string is also used in the --help flag output.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const DESC = 'Toolkit:  Manage a new toolkit group.';

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
const CONFIRM = ({ props, params, message = 'Proceed?' }) => {
    const { prompt } = props;

    return new Promise((resolve, reject) => {
        prompt.get(
            {
                properties: {
                    confirmed: {
                        description: `${chalk.white(message)} ${chalk.cyan(
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
                    resolve({ ...params, ...input });
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
const CONFORM_CREATE = ({ input, props }) => {
    const { cwd } = props;

    let output = {};
    const groups = getGroups({ props });

    Object.entries(input).forEach(([key, val]) => {
        switch (key) {
            case 'menuOrder':
                output['menuOrder'] = formatMenuOrder(val);
                break;

            default:
                output[key] = val;
                break;
        }
    });

    if (output.menuOrder >= groups.length - 1) {
        delete output.menuOrder;
    }

    output.group = {
        label: output.label,
        route: `/toolkit/${output.id}`,
        elements: {},
    };

    delete output.label;

    return output;
};

const CONFORM_UPDATE = ({ input, props }) => {
    const { cwd } = props;

    let output = {};
    const groups = getGroups({ props });

    Object.entries(input).forEach(([key, val]) => {
        switch (key) {
            case 'menuOrder':
                output['menuOrder'] = formatMenuOrder(val);
                break;

            default:
                output[key] = val;
                break;
        }
    });

    if (output.menuOrder >= groups.length - 1) {
        delete output.menuOrder;
    }

    output.group = m.menu[output.id];
    output.group.label = output.label;
    output.group.route = `/toolkit/${output.newid}`;

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
    console.log('  Some example of what this does');
    console.log('');
};

/**
 * SCHEMA_* Functions
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
            }),
        )
        .join('');

    return {
        properties: {
            action: {
                required: true,
                message: 'Select an action.',
                description: `${chalk.white(
                    'Action:',
                )} ${actionList}\n    ${chalk.white('Select:')}`,
                before: val => actionBefore({ val, actions }),
            },
        },
    };
};

const SCHEMA_CREATE = ({ props }) => {
    const { cwd, prompt } = props;
    const groups = getGroups({ props });
    const groupsLength = groups.length - 1;
    const canOverwrite = overwritable(prompt);

    return {
        properties: {
            id: {
                description: chalk.white('Group ID:'),
                required: true,
                message: 'Group ID is a required parameter',
                before: val => {
                    return formatID(val);
                },
            },
            overwrite: {
                required: true,
                pattern: /^y|n|Y|N/,
                message: '',
                description: `${chalk.white(
                    'Overwrite existing group?',
                )} ${chalk.cyan('(Y/N):')}`,
                ask: () => {
                    try {
                        const id =
                            prompt.override['id'] || prompt.history('id').value;
                        return op.get(m, `menu.${id}`, false) !== false;
                    } catch (err) {
                        return false;
                    }
                },
                before: val => {
                    return String(val).toLowerCase() === 'y';
                },
            },
            label: {
                required: true,
                description: chalk.white('Menu Link Text:'),
                message: 'Menu link is required',
                ask: () => canOverwrite,
            },
            menuOrder: {
                description: `${chalk.white('Menu Order')} ${chalk.cyan(
                    `[0-${groupsLength}]:`,
                )}`,
                default: groupsLength,
                ask: () => canOverwrite,
                before: val => {
                    if (!isNaN(val)) {
                        val = Number(String(val));
                        val = Math.max(val, 0);
                        val = Math.min(val, groupsLength);
                    } else {
                        val = groupsLength;
                    }

                    return val;
                },
            },
        },
    };
};

const SCHEMA_ID = ({ props }) => {
    const groups = getGroups({ props });
    const groupList = groups
        .map((item, index) =>
            listItem({
                item,
                index,
                padding: String(groups.length).length,
            }),
        )
        .join('');

    return {
        properties: {
            id: {
                required: true,
                message: 'Select the group.',
                description: `${chalk.white(
                    'Group:',
                )} ${groupList}\n    ${chalk.white('Select:')}`,
                before: val => groupBefore({ val, groups }),
            },
        },
    };
};

const SCHEMA_UPDATE = ({ props, id }) => {
    const { cwd, prompt } = props;
    const canOverwrite = overwritable(prompt);
    const groups = getGroups({ props });
    const group = m.menu[id];
    const groupsLength = groups.length - 1;
    const menuOrder = groups.indexOf(id);

    return {
        properties: {
            newid: {
                description: chalk.white('Update ID:'),
                required: true,
                default: id,
                message: 'Group ID is a required parameter',
                before: val => {
                    return formatID(val);
                },
            },
            label: {
                required: true,
                description: chalk.white('Menu Link Text:'),
                message: 'Menu link is required',
                default: group.label,
            },
            menuOrder: {
                description: `${chalk.white('Menu Order')} ${chalk.cyan(
                    `[0-${groupsLength}]:`,
                )}`,
                default: menuOrder,
                before: val => {
                    if (!isNaN(val)) {
                        val = Number(String(val));
                        val = Math.max(val, 0);
                        val = Math.min(val, groupsLength);
                    } else {
                        val = groupsLength;
                    }

                    return val;
                },
            },
        },
    };
};

/**
 * ACTION Functions
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
        switch (action) {
            case 'update':
                ACTION_UPDATE({ opt, props });
                break;

            case 'remove':
                ACTION_REMOVE({ opt, props });
                break;

            case 'create':
                ACTION_CREATE({ opt, props });
        }
    }
};

const ACTION_CREATE = ({ opt, props }) => {
    console.log('');

    const { cwd, prompt } = props;

    const schema = SCHEMA_CREATE({ props });

    const ovr = mapOverrides({ schema, opt });

    if (op.has(ovr, 'id')) {
        ovr['id'] = formatID(ovr.id);
    }

    if (op.has(ovr, 'menuOrder')) {
        ovr['menuOrder'] = formatMenuOrder(ovr.menuOrder);
    }

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

        const params = CONFORM_CREATE({ input, props });
        const { overwrite } = params;

        // Exit if overwrite or confirm !== true
        if (typeof overwrite === 'boolean' && !overwrite) {
            prompt.stop();
            message('Group create canceled!');
            return;
        }

        message(`A new group will be created with the following options:`);
        const preflight = { ...input };

        console.log(
            prettier.format(JSON.stringify(preflight), {
                parser: 'json-stringify',
            }),
        );

        CONFIRM({ props, params })
            .then(() => {
                console.log('');

                generator({ action: 'create', params, props }).then(success => {
                    console.log('');
                });
            })
            .catch(err => {
                prompt.stop();
                message('Group create canceled!');
            });
    });
};

const ACTION_REMOVE = ({ opt, props }) => {
    console.log('');

    const { prompt } = props;

    const schema = SCHEMA_ID({ props });

    const ovr = mapOverrides({ schema, opt });

    if (op.has(ovr, 'id')) {
        ovr['id'] = formatID(ovr.id);
    }

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

        const params = { ...input };

        const warning = `Are you sure you want to remove the ${chalk.cyan(
            params.id,
        )} group?`;

        CONFIRM({ props, params, message: warning })
            .then(() => {
                console.log('');

                generator({ action: 'remove', params, props }).then(success => {
                    console.log('');
                });
            })
            .catch(err => {
                prompt.stop();
                message('Group remove canceled!');
            });
    });
};

const ACTION_UPDATE = ({ opt, props }) => {
    console.log('');

    const { cwd, prompt } = props;

    let ovr = mapOverrides({ schema: SCHEMA_ID({ props }), opt });

    if (op.has(ovr, 'id')) {
        ovr['id'] = formatID(ovr.id);
    }

    if (op.has(ovr, 'menuOrder')) {
        ovr['menuOrder'] = formatMenuOrder(ovr.menuOrder);
    }

    prompt.override = ovr;
    prompt.start();

    new Promise((resolve, reject) => {
        prompt.get(SCHEMA_ID({ props }), (err, input) => {
            if (err) {
                reject(err);
            } else {
                resolve(input);
            }
        });
    })
        .then(input => {
            prompt.override = input;

            const { id } = input;
            const schema = SCHEMA_UPDATE({ props, id });

            return new Promise((resolve, reject) => {
                prompt.get(schema, (err, input) => {
                    input = { ...input, ...prompt.override };
                    if (err) {
                        reject(err);
                    } else {
                        resolve(input);
                    }
                });
            });
        })
        .then(input => {
            const params = CONFORM_UPDATE({ input, props });
            const { overwrite } = params;

            // Exit if overwrite or confirm !== true
            if (typeof overwrite === 'boolean' && !overwrite) {
                prompt.stop();
                message('Group update canceled!');
                return;
            }

            message(
                `The ${chalk.cyan(
                    params.id,
                )} group will be updated with the following options:`,
            );
            const preflight = { ...input };

            console.log(
                prettier.format(JSON.stringify(preflight), {
                    parser: 'json-stringify',
                }),
            );

            return CONFIRM({ props, params });
        })
        .then(params => {
            console.log('');

            generator({ action: 'update', params, props }).then(success => {
                console.log('');
            });
        })
        .catch(err => {
            prompt.stop();
            message('Group update canceled');
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
            '-o, --overwrite [overwrite]',
            'Overwrite existing group. Beware this will remove all children of the group.',
        )
        .option('-i, --id [id]', 'The group ID.')
        .option('-l, --label [label]', 'Menu Text.')
        .option('-m, --menu-order [menuOrder]', 'Menu order.')
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
    CONFORM_CREATE,
    COMMAND,
    NAME,
};
