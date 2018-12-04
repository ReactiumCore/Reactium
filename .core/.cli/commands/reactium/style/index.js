/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const _ = require('underscore');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const op = require('object-path');
const generator = require('./generator');
const globby = require('globby').sync;
const prettier = require('prettier');
const slugify = require('slugify');
const mod = path.dirname(require.main.filename);
const pad = require(`${mod}/lib/pad`);
const { error, message } = require(`${mod}/lib/messenger`);

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

const formatFilename = val => {
    const ext = val.substr(-5);
    const exts = ['.scss', '.less'];

    val = slugify(val, '-');
    val = val.substr(0, 1) !== '_' ? `_${val}` : val;
    val += exts.indexOf(ext) < 0 ? '.scss' : '';

    return val;
};

const formatImport = (val, props) => {
    const styles = topLevelStyles({ props });

    val = val
        .replace(/[^0-9\s]/g, '')
        .replace(/\s\s+/g, ' ')
        .trim();
    val = _.compact(
        val.split(' ').map(v => {
            v = Number(String(v).replace(/[^0-9]/gi)) - 1;
            return styles[v];
        }),
    );

    return val;
};

const topLevelStyles = ({ props }) => {
    const { cwd } = props;

    return globby([`${cwd}/src/**/*.scss`]).filter(
        file => String(path.basename(file)).substr(0, 1) !== '_',
    );
};

/**
 * NAME String
 * @description Constant defined as the command name. Value passed to the commander.command() function.
 * @example $ arcli re:style --path '~/src/assets/style' --name 'style.scss'
 * @see https://www.npmjs.com/package/commander#command-specific-options
 * @since 2.0.0
 */
const NAME = 'style';

/**
 * DESC String
 * @description Constant defined as the command description. Value passed to
 * the commander.desc() function. This string is also used in the --help flag output.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const DESC = 'Reactium: Create a style sheet.';

/**
 * CANCELED String
 * @description Message sent when the command is canceled
 * @since 2.0.0
 */
const CANCELED = 'Style sheet creation canceled!';

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
                const confirmed = op.get(input, 'confirmed');

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
            case 'destination':
                output[key] = formatDestination(val, props);
                break;

            case 'filename':
                output[key] = formatFilename(val);
                break;

            case 'inject':
                output[key] = formatImport(val, props);
                break;

            default:
                output[key] = val;
                break;
        }
    });

    // Set the file path
    output['filepath'] = path.normalize(
        path.join(output.destination, output.filename),
    );

    // Set the style import statement
    const ext = path.extname(output.filename);
    const fnameReplace = output.filename.replace(/^_/, '').replace(ext, '');
    output['name'] = fnameReplace;
    output['ext'] = ext;
    output['importString'] = output.inject.map(filepath =>
        path
            .relative(filepath, output.filepath)
            .replace(/^\..\//, '')
            .replace(output.filename, fnameReplace),
    );

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
    console.log(
        `  arcli style --filename '_fubar.scss' --destination '~/src/assets/style' --overwrite`,
    );
    console.log('');
};

/**
 * SCHEMA Object
 * @description used to describe the input for the prompt function.
 * @see https://www.npmjs.com/package/prompt
 * @since 2.0.0
 */
const SCHEMA = ({ props }) => {
    const { cwd, prompt } = props;
    const defaultDirectory = path.normalize('/src/assets/style');

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
            destination: {
                description: chalk.white('Destination:'),
                default: `~${defaultDirectory}`,
                required: true,
            },
            filename: {
                type: 'string',
                description: chalk.white(`File Name:`),
                message: 'File name is a required parameter',
                required: true,
                before: val => {
                    const ext = val.substr(-5);
                    const exts = ['.scss', '.less'];

                    val = val.substr(0, 1) !== '_' ? `_${val}` : val;
                    val += exts.indexOf(ext) < 0 ? '.scss' : '';

                    return val;
                },
            },
            overwrite: {
                required: true,
                pattern: /^y|n|Y|N/,
                message: '',
                description: `${chalk.white(
                    'Overwrite existing stylesheet?',
                )} ${chalk.cyan('(Y/N):')}`,
                ask: () => {
                    try {
                        let dest =
                            prompt.override['destination'] ||
                            prompt.history('destination').value;
                        dest = formatDestination(dest, props);

                        let file =
                            prompt.override['filename'] ||
                            prompt.history('filename').value;
                        file = formatFilename(file);

                        const filepath = path.normalize(path.join(dest, file));

                        return fs.existsSync(filepath);
                    } catch (err) {
                        return false;
                    }
                },
                before: val => {
                    return String(val).toLowerCase() === 'y';
                },
            },
            inject: {
                pattern: /[0-9\s]/,
                description: `${chalk.white(
                    'Import to:',
                )} ${styles}\n    ${chalk.white('Select:')}`,
                required: true,
                message: 'Select a number or list of numbers. Example: 1 2 3',
                ask: () => {
                    let overwrite;
                    try {
                        overwrite =
                            prompt.override['overwrite'] ||
                            prompt.history('overwrite').value;
                    } catch (err) {
                        overwrite = true;
                    }

                    return overwrite !== false;
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
        if (opt[key]) {
            ovr[key] = opt[key];
        }
    });

    const { overwrite } = opt;

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

        message(`A style sheet will be created with the following parameters:`);
        const preflight = { filepath: null, ...params };

        delete preflight.destination;
        delete preflight.filename;
        delete preflight.importString;

        if (overwrite !== true) {
            delete preflight.overwrite;
        }

        params['filepath'] = preflight.filepath;

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
const COMMAND = ({ program, props }) =>
    program
        .command(NAME)
        .description(DESC)
        .action(opt => ACTION({ opt, props }))
        .option(
            '-d, --destination [destination]',
            'Path where the stylesheet is saved.',
        )
        .option('-f, --filename [filename]', 'File name.')
        .option(
            '-o, --overwrite [overwrite]',
            'Overwrite the existing stylesheet.',
            false,
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
    ACTION,
    CONFIRM,
    CONFORM,
    COMMAND,
    NAME,
    topLevelStyles,
    formatImport,
};
