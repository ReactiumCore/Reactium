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
const mod = path.dirname(require.main.filename);
const { error, message } = require(`${mod}/lib/messenger`);
const _ = require('underscore');

const formatsource = (val, props) => {
    const { cwd } = props;

    val = path.normalize(val);
    val = String(val).replace(
        /^\/components\/|^components\/|^components$/i,
        `${cwd}/src/app/components/`,
    );
    val = String(val).replace(
        /^\/common-ui\/|^common-ui\/|^common-ui$/i,
        `${cwd}/src/app/components/common-ui/`,
    );
    val = String(val).replace(/^\/cwd\/|^cwd\/|^cwd/i, `${cwd}/`);
    val = val.substr(-1) !== '/' ? val + '/' : val;

    return path.normalize(val);
};

/**
 * NAME String
 * @description Constant defined as the command name. Value passed to the commander.command() function.
 * @example $ arcli library
 * @see https://www.npmjs.com/package/commander#command-specific-options
 * @since 2.0.0
 */
const NAME = 'library';

/**
 * DESC String
 * @description Constant defined as the command description. Value passed to
 * the commander.desc() function. This string is also used in the --help flag output.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const DESC =
    'Reactium: Generate a component library from the specified source directory.';

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
    const packageJSON = require(`${props.cwd}/package.json`);

    return Object.keys(input).reduce((output, key) => {
        let val = input[key];
        const pkg = op.get(output, 'newPackage', {});

        switch (key) {
            case 'verbosity':
                output[key] = Math.max(Math.min(parseInt(val), 3), 0) || 0;
                break;
            case 'destination':
            case 'source':
                output[key] = formatsource(val, props);
                break;

            case 'name':
            case 'version':
            case 'main':
            case 'author':
                if (val != '') {
                    pkg[key] = val;
                    output['newPackage'] = pkg;
                }
                break;

            case 'dependencies':
            case 'devDependencies':
                if (typeof val === 'string') {
                    val = val.replace(/\,/g, '');
                    val = val.replace(/\s\s+/g, ' ').trim();
                    val = _.compact(val.split(' '));
                }

                if (Array.isArray(val)) {
                    if (val.length > 0) {
                        const deplist = {
                            ...packageJSON.dependencies,
                            ...packageJSON.devDependencies,
                        };
                        pkg[key] = val.reduce((obj, dep) => {
                            const v = op.get(deplist, dep);
                            if (v) {
                                obj[dep] = v;
                            }
                            return obj;
                        }, {});

                        output['newPackage'] = pkg;
                    }
                }

                break;

            case 'repo':
                op.set(pkg, 'repository.url', val);
                output['newPackage'] = pkg;
                break;

            case 'repoType':
                op.set(pkg, 'repository.type', val);
                output['newPackage'] = pkg;
                break;

            case 'keywords':
                if (typeof val === 'string') {
                    val = val.replace(/\,/g, '');
                    val = val.replace(/\s\s+/g, ' ').trim();
                    val = _.compact(val.split(' '));
                }

                if (Array.isArray(val)) {
                    if (val.length > 0) {
                        pkg[key] = val;
                        output['newPackage'] = pkg;
                    }
                }

                break;

            default:
                output[key] = val;
                break;
        }

        return output;
    }, {});
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
   $ arcli library -s components/MyComponentLibrary -d cwd/lib -n MyComponentLibrary
 
 When specifying the source [-d, --source] the following shortcuts are available:
   ${chalk.cyan('components/')}  The /.src/app/components source.
   ${chalk.cyan('common-ui/')}   The /.src/app/components/common-ui source.
 `);

/**
 * FLAGS
 * @description Array of flags passed from the commander options.
 * @since 2.0.18
 */
const FLAGS = [
    'name',
    'source',
    'destination',
    'version',
    'verbosity',
    'main',
    'author',
    'dependencies',
    'devDependencies',
    'keywords',
    'repo',
    'repoType',
];

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

/**
 * PREFLIGHT Function
 */
const PREFLIGHT = ({ msg, params, props }) => {
    msg =
        msg ||
        `A new ${chalk.cyan(
            'library',
        )} will be generated with the following options:`;

    message(msg);

    // Transform the preflight object instead of the params object
    const preflight = { ...params };

    console.log(
        prettier.format(JSON.stringify(preflight), {
            parser: 'json-stringify',
        }),
    );
};

const SCHEMA_SOURCE = ({ params, props }) => {
    const name = op.get(params, 'package.name', '');

    return {
        properties: {
            source: {
                description: chalk.white('Source:'),
                message: `Enter the ${chalk.cyan('Source directory')}`,
                required: true,
            },
            destination: {
                description: chalk.white('Destination:'),
                default: path.join('cwd', 'lib', name),
            },
            verbosity: {
                description: chalk.white('Verbosity [0-3] (0):'),
                default: 0,
                required: false,
            },
        },
    };
};

const SCHEMA_NAME = ({ params, props }) => {
    let pkg;
    let p = path.join(params.source, 'package.json');

    try {
        pkg = require(p);
    } catch (err) {
        pkg = {};
    }

    const schema = {
        properties: {
            name: {
                description: chalk.white('Name:'),
                message: `Enter the ${chalk.cyan('Library name')}`,
                default: op.get(pkg, 'name'),
                required: true,
            },
        },
    };

    if (op.has(pkg, 'name')) {
        op.set(schema, 'properties.name.default', pkg.name);
    }

    return schema;
};

/**
 * SCHEMA Function
 * @description used to describe the input for the prompt function.
 * @see https://www.npmjs.com/package/prompt
 * @since 2.0.0
 */
const SCHEMA = ({ params, props }) => {
    let pkg;

    try {
        pkg = require(`${params.source}/package.json`);
    } catch (err) {
        pkg = {};
    }

    const { prompt } = props;

    const schema = {
        properties: {
            version: {
                description: chalk.white('Version:'),
                default: op.get(pkg, 'version', '0.0.1'),
            },
            main: {
                description: chalk.white('Main js file:'),
                default: op.get(pkg, 'main', 'index.js'),
            },
            author: {
                description: chalk.white('NPM Package Author:'),
                default: op.get(pkg, 'author', undefined),
            },
            dependencies: {
                description: chalk.white('NPM Dependencies:'),
                default: op.has(pkg, 'dependencies')
                    ? Object.keys(pkg.dependencies).join(', ')
                    : undefined,
            },
            devDependencies: {
                description: chalk.white('NPM Dev. Dependencies:'),
                default: op.has(pkg, 'devDependencies')
                    ? Object.keys(pkg.devDependencies).join(', ')
                    : undefined,
            },
            repo: {
                description: chalk.white('Repository:'),
                default: op.get(pkg, 'repository.url', undefined),
            },
            repoType: {
                description: chalk.white('Repository Type:'),
                default: op.get(pkg, 'repository.type', 'git'),
                ask: () => !!prompt.history('repo'),
            },
            keywords: {
                description: chalk.white('NPM Keywords:'),
                default: op.has(pkg, 'keywords')
                    ? pkg.keywords.join(', ')
                    : undefined,
            },
        },
    };

    return schema;
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
    const ovr = FLAGS_TO_PARAMS({ opt });

    prompt.override = ovr;
    prompt.start();

    let params = CONFORM({ input: ovr, props });

    return new Promise((resolve, reject) => {
        prompt.get(SCHEMA_NAME({ params, props }), (err, input = {}) => {
            if (err) {
                prompt.stop();
                reject(`${NAME} ${err.message} 386`);
                return;
            }

            input = { ...ovr, ...input };
            params = CONFORM({ input, props });

            resolve(params);
        });
    })
        .then(
            () =>
                new Promise((resolve, reject) => {
                    prompt.get(
                        SCHEMA_SOURCE({ params, props }),
                        (err, input = {}) => {
                            if (err) {
                                prompt.stop();
                                reject(`${NAME} ${err.message}`);
                                return;
                            }

                            input = { ...ovr, ...params, ...input };
                            params = CONFORM({ input, props });

                            resolve(params);
                        },
                    );
                }),
        )
        .then(
            () =>
                new Promise((resolve, reject) => {
                    prompt.get(SCHEMA({ params, props }), (err, input = {}) => {
                        if (err) {
                            prompt.stop();
                            reject(`${NAME} ${err.message}`);
                            return;
                        }

                        input = { ...ovr, ...params, ...input };
                        params = CONFORM({ input, props });

                        PREFLIGHT({ params, props });

                        resolve(params);
                    });
                }),
        )
        .then(() => {
            return CONFIRM({ props, params });
        })
        .then(async () => {
            console.log('');
            await generator({ params, props });
            console.log('');
        })
        .then(() => prompt.stop())
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
        .option('-n, --name [name]', 'Library name.')
        .option('-s, --source [source]', 'The library source.')
        .option('-d, --destination [destination]', 'The library destination.')
        .option('-V, --ver [version]', 'The version of the library.')
        .option(
            '-T, --verbosity [verbosity]',
            'The 0-3 verbosity of output. Default 0.',
        )
        .option('-m, --main [main]', 'The library entry point or main js file.')
        .option('-a, --author [author]', 'The library author.')
        .option('--dependencies [dependencies]', 'The library dependencies.')
        .option(
            '--devDependencies [devDependencies]',
            'The library devDependencies',
        )
        .option('--repo [repo]', 'The repo url.')
        .option('--repoType [repoType]', 'The repo type.')
        .option('--keywords [keywords]', 'The NPM keywords.')
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
