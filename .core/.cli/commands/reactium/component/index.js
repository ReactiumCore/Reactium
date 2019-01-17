/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const chalk = require('chalk');
const prettier = require('prettier');
const fs = require('fs-extra');
const path = require('path');
const camelCase = require('camelcase');
const decamelize = require('decamelize');
const slugify = require('slugify');
const _ = require('underscore');
const generator = require('./generator');
const op = require('object-path');
const mod = path.dirname(require.main.filename);
const pad = require(`${mod}/lib/pad`);

const { error, message } = require(`${mod}/lib/messenger`);

const { formatImport, topLevelStyles } = require('../style');

const formatDestination = (val, props) => {
    const { cwd } = props;

    val = path.normalize(val);
    val = String(val).replace(/^~\/|^\/cwd\/|^cwd\/|^cwd$/i, `${cwd}/`);
    val = String(val).replace(
        /^\/core\/|^core\/|^core/i,
        `${cwd}/.core/components/`,
    );
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

const formatName = val => {
    if (val) {
        val = String(val).replace(/[^a-zA-Z\s]/gm, '');
        val = camelCase(val, { pascalCase: true });
    }

    return val;
};

const formatRoute = val => {
    const specialChars = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ';
    const specialReplace = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh';
    const special = new RegExp(specialChars.split('').join('|'), 'g');

    val = val.toLowerCase();
    val = val.replace(special, c =>
        specialReplace.charAt(specialChars.indexOf(c)),
    );
    val = slugify(val, { remove: /[*+~()'"!@]/g });

    return val;
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

const formatID = prompt => {
    let ID = op.get(prompt, 'override.ID', null);
    ID = !ID ? op.get(prompt, 'override.name', null) : ID;

    if (!ID) {
        ID = prompt.history('name').value;
    }

    return decamelize(ID).toUpperCase();
};

/**
 * NAME String
 * @description Constant defined as the command name. Value passed to the commander.command() function.
 * @example $ arcli component
 * @see https://www.npmjs.com/package/commander#command-specific-options
 * @since 2.0.0
 */
const NAME = 'component';

/**
 * DESC String
 * @description Constant defined as the command description. Value passed to
 * the commander.desc() function. This string is also used in the --help flag output.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const DESC = 'Reactium: Create or replace a component.';

/**
 * CANCELED String
 * @description Message sent when the command is canceled
 * @since 2.0.0
 */
const CANCELED = 'Component creation canceled!';

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
        switch (String(key).toLowerCase()) {
            case 'destination':
                output[key] = formatDestination(val, props);
                break;

            case 'name':
                key = String(key).toLowerCase();
                output[key] = formatName(val);
                break;

            case 'redux':
                output[key] = typeof val === 'string' ? false : val;
                break;

            case 'route':
                if (typeof val === 'string') {
                    val = _.compact(val.split(' '));
                }
                val = Array.isArray(val) ? val : [val];
                output[key] = val.length < 1 ? false : val;
                break;

            case 'actions':
            case 'actiontypes':
            case 'reducers':
            case 'services':
                output[key] =
                    typeof val === 'string' && val.toUpperCase() === 'Y'
                        ? true
                        : val;
                break;

            case 'inject':
                output[key] = formatImport(val, props);
                break;

            default:
                output[key] = val;
                break;
        }
    });

    if (output.redux === false) {
        Object.entries(input).forEach(([key, val]) => {
            switch (String(key).toLowerCase()) {
                case 'actions':
                case 'actiontypes':
                case 'reducers':
                case 'services':
                    output[key] = false;
                    break;
            }
        });
    }

    output.ID = op.get(output, 'ID', output.name);
    output.ID = decamelize(output.ID).toUpperCase();

    const dir = path.basename(output.destination).toLowerCase();
    if (dir !== output.name.toLowerCase()) {
        output.destination = path.join(output.destination, output.name);
    }

    // Set the style import statement
    if (output.stylesheet === true) {
        const stylesheetFile = path.normalize(
            path.join(output.destination, '_style.scss'),
        );

        const importString = output.inject.map(filepath =>
            path
                .relative(filepath, stylesheetFile)
                .replace(/^\..\//, '')
                .replace('_style.scss', 'style'),
        );

        output.stylesheet = {
            filename: '_style.scss',
            filepath: stylesheetFile,
            destination: output.destination,
            name: 'style',
            ext: '.scss',
            overwrite: '',
            inject: Array.from(output.inject),
            importString: importString,
        };
    }

    delete output.inject;

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
    console.log('  arcli component --type class --redux --route');
    console.log('  arcli component --type function');
    console.log('');
};

/**
 * SCHEMA Function
 * @description used to describe the input for the prompt function.
 * @see https://www.npmjs.com/package/prompt
 * @since 2.0.0
 */
const SCHEMA = ({ props }) => {
    const { config, cwd, prompt } = props;

    const types = op.get(config, 'reactium.types', []);
    const typeSelections = types
        .map((type, index) => {
            return `\n\t    ${chalk.cyan(`${index + 1}.`)} ${chalk.white(
                type,
            )}`;
        })
        .join('');

    const defaultDirectory = path.normalize('components/');

    const styleList = topLevelStyles({ props });
    const styleLen = String(styleList.length).length;
    const styles = styleList
        .map((file, index) => {
            index += 1;
            let i = chalk.cyan(pad(index, styleLen) + '.');
            return `\n\t    ${i} ${chalk.white(file)}`;
        })
        .join('');

    return {
        properties: {
            name: {
                required: true,
                message: ' Component name is required',
                description: chalk.white('Component Name:'),
            },
            destination: {
                description: chalk.white('Destination:'),
                default: defaultDirectory,
                required: true,
                message: ' Input component destination',
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
                        let dir =
                            prompt.override['name'] ||
                            prompt.history('name').value;
                        let dest =
                            prompt.override['destination'] ||
                            prompt.history('destination').value;
                        dest = path.join(dest, dir);
                        dest = formatDestination(dest, props);

                        return fs.existsSync(dest);
                    } catch (err) {
                        return false;
                    }
                },
                before: val => {
                    return String(val).toUpperCase() === 'Y';
                },
            },
            type: {
                required: true,
                message: ` Select the component type: ${types.join(' | ')}`,
                description: `${chalk.white(
                    'Type:',
                )} ${typeSelections}\n    ${chalk.white('Select:')}`,
                before: val => {
                    if (!isNaN(val)) {
                        val = Number(String(val)) - 1;
                        if (val >= types.length || val < 0) {
                            return 'class';
                        } else {
                            return types[val];
                        }
                    }
                },
                ask: () => overwritable(prompt),
            },
            route: {
                description: chalk.white('Route:'),
                ask: () => {
                    let type;

                    try {
                        type =
                            prompt.override['type'] ||
                            prompt.history('type').value;
                    } catch (err) {
                        type = 'class';
                    }

                    return type === 'class' && overwritable(prompt);
                },
                before: val => {
                    const routes = val.split(' ') || [];
                    return _.compact(routes.map(route => formatRoute(route)));
                },
            },
            redux: {
                pattern: /^y|n|Y|N/,
                default: 'Y',
                description: `${chalk.white('Redux?')} ${chalk.cyan('(Y/N):')}`,
                required: true,
                ask: () => {
                    let type;

                    try {
                        type =
                            prompt.override['type'] ||
                            prompt.history('type').value;
                    } catch (err) {
                        type = 'class';
                    }

                    return type === 'class' && overwritable(prompt);
                },
                before: val => {
                    return String(val).toUpperCase() === 'Y';
                },
            },
            actions: {
                pattern: /^y|n|Y|N/,
                default: 'Y',
                description: `${chalk.white('Actions?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                ask: () => {
                    try {
                        return (
                            prompt.override['redux'] ||
                            (prompt.history('redux').value &&
                                overwritable(prompt))
                        );
                    } catch (err) {
                        return false;
                    }
                },
                before: val => {
                    return String(val).toUpperCase() === 'Y';
                },
            },
            actionTypes: {
                pattern: /^y|n|Y|N/,
                default: 'Y',
                description: `${chalk.white('Actions Types?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                ask: () => {
                    try {
                        return (
                            prompt.override['redux'] ||
                            (prompt.history('redux').value &&
                                overwritable(prompt))
                        );
                    } catch (err) {
                        return false;
                    }
                },
                before: val => {
                    return String(val).toUpperCase() === 'Y';
                },
            },
            reducers: {
                pattern: /^y|n|Y|N/,
                default: 'Y',
                description: `${chalk.white('Reducers?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                ask: () => {
                    try {
                        return (
                            prompt.override['redux'] ||
                            (prompt.history('redux').value &&
                                overwritable(prompt))
                        );
                    } catch (err) {
                        return false;
                    }
                },
                before: val => {
                    return String(val).toUpperCase() === 'Y';
                },
            },
            plugin: {
                pattern: /^y|n|Y|N/,
                default: 'Y',
                description: `${chalk.white('Plugin?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                ask: () => overwritable(prompt),
                before: val => {
                    return String(val).toUpperCase() === 'Y';
                },
            },
            services: {
                pattern: /^y|n|Y|N/,
                default: 'Y',
                description: `${chalk.white('Services?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                ask: () => overwritable(prompt),
                before: val => {
                    return String(val).toUpperCase() === 'Y';
                },
            },
            stylesheet: {
                pattern: /^y|n|Y|N/,
                default: 'Y',
                message: ' Add a style sheet?',
                description: `${chalk.white('Stylesheet?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                ask: () => overwritable(prompt),
                before: val => {
                    return String(val).toUpperCase() === 'Y';
                },
            },
            inject: {
                pattern: /[0-9\s]/,
                description: `${chalk.white(
                    'Import stylesheet to:',
                )} ${styles}\n    ${chalk.white('Select:')}`,
                required: true,
                message: 'Select a number or list of numbers. Example: 1 2 3',
                ask: () => {
                    try {
                        return (
                            prompt.override['stylesheet'] ||
                            (prompt.history('stylesheet').value &&
                                overwritable(prompt))
                        );
                    } catch (err) {
                        return false;
                    }
                },
            },
            library: {
                pattern: /^y|n|Y|N/,
                default: 'N',
                description: `${chalk.white('Library?')} ${chalk.cyan(
                    '(Y/N):',
                )}`,
                ask: () => overwritable(prompt),
                before: val => {
                    return String(val).toUpperCase() === 'Y';
                },
            },
            test: {
                pattern: /^y|n|Y|N/,
                default: 'Y',
                description: `${chalk.white('Test?')} ${chalk.cyan('(Y/N):')}`,
                ask: () => overwritable(prompt),
                before: val => {
                    return String(val).toUpperCase() === 'Y';
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
const ACTION = ({ opt, props }) => {
    console.log('');

    const { cwd, prompt } = props;

    const ovr = {};
    const schema = SCHEMA({ props });
    Object.keys(schema.properties).forEach(key => {
        let k = key;

        const val = op.get(opt, k, undefined);

        if (typeof val === 'function') {
            val = undefined;
        }

        if (val) {
            ovr[key] = val;
        }
    });

    if (op.get(opt, 'reduxAll', false) === true) {
        const reduxParams = ['redux', 'actions', 'actionTypes', 'reducers'];
        reduxParams.forEach(k => {
            ovr[k] = true;
        });
    }

    if (op.get(ovr, 'redux', false) === true) {
        ovr['type'] = 'class';
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

        input['ID'] = op.get(opt, 'ID', undefined);

        const params = CONFORM({ input, props });
        const { overwrite } = params;

        // Exit if overwrite or confirm !== true
        if (typeof overwrite === 'boolean' && !overwrite) {
            prompt.stop();
            message(CANCELED);
            return;
        }

        message(`A component will be created with the following options:`);
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

/**
 * COMMAND Function
 * @description Function that executes program.command()
 */
const COMMAND = ({ program, props }) => {
    const { config } = props;
    const types = op.get(config, 'reactium.types', []);

    return program
        .command(NAME)
        .description(DESC)
        .action(opt => ACTION({ opt, props }))
        .option('-r, --redux-all [reduxAll]', 'Include all Redux files.')
        .option('-n, --name [name]', 'Component name.')
        .option(
            '-d, --destination [destination]',
            'Component parent directory.',
        )
        .option('-o, --overwrite [overwrite]', 'Overwrite existing component.')
        .option('-t, --type [type]', `Component type: ${types.join(' | ')}.`)
        .option('--redux [redux]', 'Create Redux Class component.')
        .option('--route [route]', 'Include route.js file.')
        .option('--actions [actions]', 'Include Redux actions.js file.')
        .option(
            '--actionTypes [actionTypes]',
            'Include Redux actionTypes.js file.',
        )
        .option('--reducers [reducers]', 'Include Redux reducers.js file.')
        .option('--plugin [plugin]', 'Include plugin.js file.')
        .option('--services [services]', 'Include services.js file.')
        .option('--stylesheet [stylesheet]', 'Include style.scss file.')
        .on('--help', HELP);
};

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
    formatDestination,
    formatName,
    formatRoute,
};
