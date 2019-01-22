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
const decamelize = require('decamelize');
const mod = path.dirname(require.main.filename);
const pad = require(`${mod}/lib/pad`);
const listItem = require(`${mod}/lib/listItem`);
const manifest = require('../manifest');

const m = {};

const { error, message } = require(`${mod}/lib/messenger`);

const { formatImport, topLevelStyles } = require('../../reactium/style');

const { formatName, formatRoute } = require('../../reactium/component');

const formatID = val => {
    val = formatName(val);
    return String(decamelize(val, '-')).replace(/[^a-z0-9\-]/gi, '');
};

const formatMenuOrder = val => {
    if (isNaN(val)) {
        return null;
    }
    return Number(String(val).replace(/\D/gi, ''));
};

const getElements = ({ props, group }) => {
    return Object.keys(op.get(m, `menu.${group}.elements`, {}));
};

const getGroups = ({ props }) => {
    return Object.keys(m.menu);
};

const mapElement = ({ output, input, props }) => {
    const element = {};
    const keys = [
        'type',
        'label',
        'route',
        'dna',
        'component',
        'readme',
        'hideCode',
        'hideDna',
        'hideDocs',
    ];

    keys.forEach(key => {
        const val = output[key];

        switch (key) {
            case 'component':
            case 'readme':
                if (val) {
                    element[key] = `require('${val}').default`;
                }
                break;

            default:
                if (val) {
                    element[key] = val;
                }
                break;
        }

        delete output[key];
    });

    return element;
};

const mapOverrides = ({ schema, opt }) => {
    return Object.keys(schema.properties).reduce((obj, key) => {
        let val = opt[key];
        val = typeof val === 'function' ? null : val;
        if (val) {
            obj[key] = val;
        }
        return obj;
    }, {});
};

const mapStyleSheet = ({ output, input, props }) => {
    const { cwd } = props;

    let stylesheet;

    if (op.get(output, 'stylesheet', false) === true) {
        const dest = path.normalize(
            `${cwd}/src/app/toolkit/${output.group}/${output.name}`,
        );
        const stylesheetFile = path.normalize(path.join(dest, '_style.scss'));

        const importString = output.inject.map(filepath =>
            path
                .relative(filepath, stylesheetFile)
                .replace(/^\..\//, '')
                .replace('_style.scss', 'style'),
        );

        stylesheet = {
            filename: '_style.scss',
            filepath: stylesheetFile,
            destination: dest,
            name: 'style',
            ext: '.scss',
            overwrite: '',
            inject: Array.from(output.inject),
            importString: importString,
        };
    }

    return stylesheet;
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

const removable = prompt => op.get(prompt, 'override.remove', false);

const groupBefore = ({ val, groups, defaultGroup = 'uncategorized' }) => {
    try {
        if (!isNaN(val)) {
            val = Number(String(val)) - 1;
            return groups[val];
        }
    } catch (err) {
        return null;
    }
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

const typeBefore = ({ val, types, defaultType = 'organism' }) => {
    if (!isNaN(val)) {
        val = Number(String(val)) - 1;

        if (val >= types.length || val < 0) {
            return defaultType;
        } else {
            return types[val];
        }
    } else {
        return val;
    }
};

/**
 * NAME String
 * @description Constant defined as the command name. Value passed to the commander.command() function.
 * @example $ arcli element
 * @see https://www.npmjs.com/package/commander#command-specific-options
 * @since 2.0.0
 */
const NAME = 'element [action]';

/**
 * DESC String
 * @description Constant defined as the command description. Value passed to
 * the commander.desc() function. This string is also used in the --help flag output.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const DESC = 'Toolkit:  Create/Update/Remove a toolkit element.';

/**
 * CANCELED String
 * @description Message sent when the command is canceled
 * @since 2.0.0
 */
const CANCELED = 'Element action canceled!';

/**
 * HELP Function
 * @description Function called in the commander.on('--help', callback) callback.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const HELP = () => {
    const output = `

Actions:
  <create> - Create a new toolkit element:
    $ arcli element create

  <update> - Update a toolkit manifest entry:
    $ arcli element update

  <remove> - Remove a toolkit element:
    $ arcli element remove

`;
    console.log(output);
};

/**
 * confirm({ props:Object, params:Object }) Function
 * @description Prompts the user to confirm the operation
 * @since 2.0.0
 */
const CONFIRM = ({ props, params, description }) => {
    const { prompt } = props;

    description =
        description || `${chalk.white('Proceed?')} ${chalk.cyan('(Y/N):')}`;

    return new Promise((resolve, reject) => {
        prompt.get(
            {
                properties: {
                    confirmed: {
                        description,
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
                    resolve(confirmed);
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
    const { cwd } = props;

    let output = {};

    Object.entries(input).forEach(([key, val]) => {
        switch (key) {
            case 'name':
                output[key] = formatName(val);
                break;

            case 'inject':
                output[key] = formatImport(val, props);
                break;

            case 'documentation':
                output[key] = val;
                output['hideDocs'] = !val;
                break;

            case 'dna':
                output['hideDna'] = !val;
                break;

            case 'code':
                output['hideCode'] = !val;
                break;

            case 'menuOrder':
                output['menuOrder'] = formatMenuOrder(val);
                break;

            default:
                output[key] = val;
                break;
        }
    });

    // set the ID if none
    if (!op.get(output, 'ID')) {
        output['ID'] = formatID(input.name);
    }

    // route
    output['route'] = `/toolkit/${output.group}/${output.ID}`;

    // dna
    output['dna'] = `/toolkit/${output.group}/${output.name}`;

    // component path
    output['component'] = `appdir/toolkit/${output.group}/${output.name}`;

    // readme
    if (op.get(output, 'documentation')) {
        output['readme'] = `${output.component}/readme`;
    }

    // set the manifest object
    output['element'] = mapElement({ output, props, input });

    // set the style import statement
    output['stylesheet'] = mapStyleSheet({ output, props, input });

    // destination
    output['destination'] = path.normalize(
        `${cwd}/src/app/toolkit/${output.group}/${output.name}`,
    );

    delete output.documentation;
    delete output.inject;
    delete output.code;

    return output;
};

const CONFORM_UPDATE = ({ props, input }) => {
    const { cwd } = props;

    let output = {
        prev: ['group', 'ID', 'element', 'key'].reduce((val, key) => {
            val[key] = input[key];
            return val;
        }, {}),
        new: {},
    };

    const groupElements = Object.keys(
        op.get(m, `menu.${output.prev.group}.elements`, {}),
    );
    const prevMenuOrder = groupElements.indexOf(output.prev.ID);

    Object.entries(input).forEach(([key, val]) => {
        switch (key) {
            case 'name':
                output.new[key] = formatName(val);
                output.prev[key] = formatName(
                    path.basename(output.prev.element.dna),
                );
                break;

            case 'documentation':
                output.new[key] = val;
                output.new['hideDocs'] = !val;
                break;

            case 'dna':
                output.new['hideDna'] = !val;
                break;

            case 'code':
                output.new['hideCode'] = !val;
                break;

            case 'menuOrder':
                output.new['menuOrder'] = formatMenuOrder(val);
                output.prev['menuOrder'] = prevMenuOrder;
                break;

            default:
                output.new[key] = val;
                break;
        }
    });

    // set the ID if none
    output.new['ID'] = formatID(input.name);

    // route
    output.new['route'] = `/toolkit/${output.new.group}/${output.new.ID}`;

    // dna
    output.new['dna'] = `/toolkit/${output.new.group}/${output.new.name}`;

    // component path
    output.new['component'] = `appdir/toolkit/${output.new.group}/${
        output.new.name
    }`;

    // readme
    if (op.get(output, 'new.documentation')) {
        output.new['readme'] = `${output.new.component}/readme`;
    }

    // set the manifest object
    output.new['element'] = mapElement({ output: output.new, props, input });

    // destination
    output.new['destination'] = path.normalize(
        `${cwd}/src/app/toolkit/${output.new.group}/${output.new.name}`,
    );
    output.prev['destination'] = path.normalize(
        `${cwd}/src/app/toolkit/${output.prev.group}/${output.prev.name}`,
    );

    // key
    output.new['key'] = `menu.${output.new.group}.elements.${output.new.ID}`;

    delete output.new.documentation;

    return output;
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
    const { cwd, prompt, config } = props;

    const types = op.get(config, 'toolkit.types', []);
    const typeList = types
        .map((item, index) =>
            listItem({
                item,
                index,
                padding: String(types.length).length,
            }),
        )
        .join('');

    const styles = topLevelStyles({ props });
    const styleList = styles
        .map((item, index) =>
            listItem({
                item,
                index,
                padding: String(styles.length).length,
            }),
        )
        .join('');

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

    const canRemove = removable(prompt);
    const canOverwrite = overwritable(prompt);

    return {
        properties: {
            type: {
                required: true,
                message: ` Select the element type`,
                description: `${chalk.white(
                    'Type:',
                )} ${typeList}\n    ${chalk.white('Select:')}`,
                before: val => typeBefore({ val, types }),
            },
            group: {
                required: true,
                message:
                    'Select the menu group or enter the name of a new group.',
                description: `${chalk.white(
                    'Menu Group:',
                )} ${groupList}\n    ${chalk.white('Select:')}`,
                before: val => groupBefore({ val, groups }),
            },
            name: {
                required: true,
                description: chalk.white('Element name:'),
                message: 'Element name is required',
            },
            overwrite: {
                required: true,
                pattern: /^y|n|Y|N/,
                message: '',
                description: `${chalk.white(
                    'Overwrite existing component?',
                )} ${chalk.cyan('(Y/N):')}`,
                ask: () => {
                    try {
                        const group =
                            prompt.override['group'] ||
                            prompt.history('group').value;

                        let name =
                            prompt.override['name'] ||
                            prompt.history('name').value;
                        name = formatID(name);

                        return (
                            op.get(
                                m,
                                `menu.${group}.elements.${name}`,
                                false,
                            ) !== false
                        );
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
                description: chalk.white('Menu Order:'),
                ask: () => canOverwrite,
            },
            documentation: {
                pattern: /^y|n/i,
                default: 'Y',
                description: `${chalk.white('Documentation?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                ask: () => canOverwrite,
                before: val => {
                    return String(val).toLowerCase() === 'y';
                },
            },
            code: {
                pattern: /^y|n/i,
                default: 'Y',
                description: `${chalk.white('Show Code?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                ask: () => canOverwrite,
                before: val => {
                    return String(val).toLowerCase() === 'y';
                },
            },
            dna: {
                pattern: /^y|n|Y|N/,
                default: 'Y',
                description: `${chalk.white('Show DNA?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                ask: () => canOverwrite,
                before: val => {
                    return String(val).toLowerCase() === 'y';
                },
            },
            stylesheet: {
                pattern: /^y|n|Y|N/,
                default: 'Y',
                message: ' Add a style sheet?',
                description: `${chalk.white('Stylesheet?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                ask: () => canOverwrite,
                before: val => {
                    return String(val).toLowerCase() === 'y';
                },
            },
            inject: {
                required: true,
                pattern: /[0-9\s]/,
                message: 'Select a number or list of numbers. Example: 1 2 3',
                description: `${chalk.white(
                    'Import stylesheet to:',
                )} ${styleList}\n    ${chalk.white('Select:')}`,
                ask: () => {
                    try {
                        return (
                            prompt.override['stylesheet'] ||
                            (prompt.history('stylesheet').value && canOverwrite)
                        );
                    } catch (err) {
                        return false;
                    }
                },
            },
        },
    };
};

const SCHEMA_GROUP = ({ props }) => {
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
            group: {
                required: true,
                message: 'Select the menu group.',
                description: `${chalk.white(
                    'Menu Group:',
                )} ${groupList}\n    ${chalk.white('Select:')}`,
                before: val => groupBefore({ val, groups }),
            },
        },
    };
};

const SCHEMA_ELEMENT = ({ props, group }) => {
    const elements = getElements({ props, group });
    const elementList = elements
        .map((item, index) =>
            listItem({
                item,
                index,
                padding: String(elements.length).length,
            }),
        )
        .join('');

    return {
        properties: {
            ID: {
                required: true,
                message: 'Select the element.',
                description: `${chalk.white(
                    'Element:',
                )} ${elementList}\n    ${chalk.white('Select:')}`,
                before: input => {
                    if (!isNaN(input)) {
                        let val = Number(String(input)) - 1;
                        if (val < elements.length && val >= 0) {
                            return elements[val];
                        } else {
                            return Number(input);
                        }
                    }

                    return input;
                },
            },
        },
    };
};

const SCHEMA_UPDATE = ({ props, params }) => {
    const schemaGroup = SCHEMA_GROUP({ props });

    const { group, name, element, ID } = params;
    const {
        type,
        label,
        hideDna = false,
        hideCode = false,
        hideDocs = false,
    } = element;
    const { cwd, prompt, config } = props;

    const types = op.get(config, 'toolkit.types', []);
    const typeList = types
        .map((item, index) =>
            listItem({
                item,
                index,
                padding: String(types.length).length,
            }),
        )
        .join('');

    const groupElements = Object.keys(op.get(m, `menu.${group}.elements`, {}));
    const menuOrder = groupElements.indexOf(ID);

    return {
        properties: {
            type: {
                required: true,
                default: type,
                message: ` Select the element type`,
                description: `${chalk.white(
                    'Type:',
                )} ${typeList}\n    ${chalk.white('Select:')}`,
                before: val => typeBefore({ val, types }),
            },
            name: {
                required: true,
                default: name,
                message: chalk.white('Update Element Name:'),
            },
            label: {
                required: true,
                default: label,
                description: chalk.white('Menu Link Text:'),
                message: 'Menu link is required',
            },
            menuOrder: {
                default: menuOrder,
                description: `${chalk.white('Menu Order:')} ${chalk.cyan(
                    `[0-${groupElements.length - 1}]`,
                )}`,
            },
            documentation: {
                pattern: /^y|n/i,
                default: hideDocs ? 'N' : 'Y',
                description: `${chalk.white('Documentation?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                before: val => {
                    return String(val).toLowerCase() === 'y';
                },
            },
            code: {
                pattern: /^y|n/i,
                default: hideCode ? 'N' : 'Y',
                description: `${chalk.white('Show Code?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                before: val => {
                    return String(val).toLowerCase() === 'y';
                },
            },
            dna: {
                pattern: /^y|n|Y|N/,
                default: hideDna ? 'N' : 'Y',
                description: `${chalk.white('Show DNA?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                before: val => {
                    return String(val).toLowerCase() === 'y';
                },
            },
        },
    };
};

const ACTION_CREATE = ({ opt, props }) => {
    console.log('');

    const { cwd, prompt } = props;

    const { id, menuOrder, overwrite } = opt;

    const schema = SCHEMA_CREATE({ props });

    const ovr = mapOverrides({ schema, opt });

    if (id) {
        ovr['ID'] = formatID(id);
    }

    if (menuOrder) {
        ovr['menuOrder'] = formatMenuOrder(menuOrder);
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

        const params = CONFORM({ input, props });
        const { overwrite } = params;

        // Exit if overwrite or confirm !== true
        if (typeof overwrite === 'boolean' && !overwrite) {
            prompt.stop();
            message(CANCELED);
            return;
        }

        message(`A new element will be created with the following options:`);
        const preflight = { ...params };

        console.log(
            prettier.format(JSON.stringify(preflight), {
                parser: 'json-stringify',
            }),
        );

        CONFIRM({ props, params })
            .then(() => {
                console.log('');

                generator({ params, props }).then(success => {
                    console.log('');
                });
            })
            .catch(err => {
                prompt.stop();
                message(CANCELED);
            });
    });
};

const ACTION_REMOVE = ({ opt, props }) => {
    console.log('');

    const { prompt } = props;

    const { id } = opt;

    const schema = SCHEMA_GROUP({ props });
    const ovr = mapOverrides({ schema, opt });

    let params = {};

    prompt.override = ovr;
    prompt.start();

    const prom = new Promise((resolve, reject) => {
        prompt.get(schema, (err, input) => {
            if (err) {
                reject(err);
            } else {
                resolve(input);
            }
        });
    })
        .then(input => {
            params = { ...params, ...input };
            const { group } = params;

            return new Promise((resolve, reject) => {
                const schemaID = SCHEMA_ELEMENT({ props, group });
                prompt.override = params;
                prompt.get(schemaID, (err, input) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(input);
                    }
                });
            });
        })
        .then(input => {
            params = { ...ovr, ...params, ...input };

            const { cwd } = props;
            const { ID, group } = params;
            const key = `menu.${group}.elements.${ID}`;
            const element = op.get(m, key, {});
            const description = `${chalk.white(
                'Are you sure you want to delete',
            )} ${chalk.cyan(`${group}.${ID}`)} ${chalk.white(
                'element?',
            )} ${chalk.cyan('(Y/N):')}`;

            params['key'] = key;
            params['remove'] = true;
            params['element'] = element;
            params['name'] = path.basename(element.dna);
            params['destination'] = path.normalize(
                `${cwd}/src/app/${element.dna}`,
            );

            return CONFIRM({ props, params, description });
        })
        .then(confirmed => {
            params['confirmed'] = confirmed;

            console.log('');

            return generator({ params, props });
        })
        .then(success => {
            console.log('');
        })
        .catch(err => {
            prompt.stop();
            message('Element remove canceled!');
        });
};

const ACTION_UPDATE = ({ opt, props }) => {
    console.log('');

    const { prompt } = props;

    const schemaGroup = SCHEMA_GROUP({ props });
    const ovr = ['id', 'group'].reduce((val, k) => {
        const skey = k === 'id' ? 'ID' : k;
        val[skey] = opt[k];
        return val;
    }, {});

    let params = {};

    prompt.override = ovr;
    prompt.start();

    const prom = new Promise((resolve, reject) => {
        prompt.get(schemaGroup, (err, input) => {
            if (err) {
                reject(err);
            } else {
                resolve(input);
            }
        });
    })
        .then(input => {
            params = { ...params, ...input };
            const { group } = params;
            const schemaElement = SCHEMA_ELEMENT({ props, group });

            return new Promise((resolve, reject) => {
                prompt.get(schemaElement, (err, input) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(input);
                    }
                });
            });
        })
        .then(input => {
            params = { ...params, ...input };
            const { group, ID } = params;
            const key = `menu.${group}.elements.${ID}`;
            const element = op.get(m, key, null);

            if (!element) {
                throw `${chalk.cyan(`${group}.${ID}`)} element not found.`;
            }

            params['element'] = element;
            params['key'] = key;
            params['name'] = path.basename(element.dna);

            schemaUpdate = SCHEMA_UPDATE({ props, params });

            return new Promise((resolve, reject) => {
                prompt.get(schemaUpdate, (err, input) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(input);
                    }
                });
            });
        })
        .then(input => {
            params = { ...params, ...input };

            params = CONFORM_UPDATE({ props, input: params });

            console.log('');

            console.log(
                prettier.format(JSON.stringify(params.new), {
                    parser: 'json-stringify',
                }),
            );

            return CONFIRM({ props, params });
        })
        .then(confirmed => {
            params['update'] = confirmed;

            console.log('');

            return generator({ params, props });
        })
        .then(success => {
            console.log('');
        })
        .catch(err => {
            prompt.stop();
            console.log('');
            error('Element update canceled');
        });
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
        switch (action) {
            case 'update':
                ACTION_UPDATE({ opt, props });
                break;

            case 'remove':
                ACTION_REMOVE({ opt, props });
                break;

            case 'create':
            default:
                ACTION_CREATE({ opt, props });
        }
    }
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
        .option('-o, --overwrite [overwrite]', 'Overwrite existing element.')
        .option('-i, --id [id]', 'The element ID.')
        .option('-n, --name [name]', 'The element name.')
        .option('-g, --group [group]', 'The menu group to add the element to.')
        .option('-l, --label [label]', 'The menu link text.')
        .option('-m, --menu-order [menuOrder]', 'The menu link index.')
        .option('-s, --stylesheet [stylesheet]', 'Add a stylesheet.')
        .option('-d, --documentation [documentation]', 'Show readme.')
        .option('-c, --code [code]', 'Show Code view.')
        .option('-D, --dna [dna]', 'Show DNA info.')
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
    formatMenuOrder,
    formatID,
    mapOverrides,
};
