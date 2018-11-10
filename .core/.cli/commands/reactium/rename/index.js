/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const chalk = require('chalk');
const generator = require('./generator');
const prettier = require('prettier');
const path = require('path');
const globby = require('globby').sync;
const mod = path.dirname(require.main.filename);
const { error, message } = require(`${mod}/lib/messenger`);
const pad = require(`${mod}/lib/pad`);
const formatName = require('../component').formatName;
const formatDestination = require('../component').formatDestination;
const testflight = require('./testflight');

const componentSearch = ({ name, props }) => {
    const { cwd, root } = props;

    name = formatName(name);
    const glob = String(`${cwd}/src/**/${name}/index.js`);
    return globby([glob]).map(file => path.dirname(file));
};

const formatDirectory = ({ val, props, name }) => {
    const { cwd } = props;

    name = formatName(name);

    val = formatDestination(val, props);
    val = path.join(val, name);

    return path.normalize(val);
};

/**
 * NAME String
 * @description Constant defined as the command name. Value passed to the commander.command() function.
 * @example $ arcli rename -f FooBar -t FuBar -d components
 * @see https://www.npmjs.com/package/commander#command-specific-options
 * @since 2.0.0
 */
const NAME = 'rename';

/**
 * DESC String
 * @description Constant defined as the command description. Value passed to
 * the commander.desc() function. This string is also used in the --help flag output.
 * @see https://www.npmjs.com/package/commander#automated---help
 * @since 2.0.0
 */
const DESC = 'Reactium: Rename a component.';

/**
 * CANCELED String
 * @description Message sent when the command is canceled
 * @since 2.0.0
 */
const CANCELED = 'Rename canceled!';

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
                            '(Y/N):'
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
                try {
                    params['confirmed'] = input.confirmed;
                } catch (err) {
                    params['confirmed'] = false;
                }

                if (error || params.confirmed === false) {
                    reject(error);
                } else {
                    resolve(params);
                }
            }
        );
    });
};

/**
 * search({ props:Object, params:Object }) Function
 * @description Search the ~/src directory for a directory with the name of the component.
 * @return Array List of directories.
 * @since 2.0.0
 */
const SEARCH = ({ props, params }) => {
    const { prompt } = props;
    const { from } = params;

    let directory;

    try {
        directory = params.directory;
    } catch (err) {}

    return directory
        ? new Promise(resolve => resolve(directory))
        : new Promise((resolve, reject) => {
              const search = componentSearch({ name: from, props });

              if (search.length === 1) {
                  resolve(path.dirname(search[0]));
                  return;
              }

              if (search.length < 1) {
                  prompt.stop();
                  error('Cannot find component directory');
                  reject({ message: 'no component', code: 500 });
              }

              const selections = search
                  .map((type, index) => {
                      return `\n\t    ${chalk.cyan(
                          `${index + 1}.`
                      )} ${chalk.white(type)}`;
                  })
                  .join('');

              prompt.get(
                  {
                      properties: {
                          directory: {
                              description: `${chalk.white(
                                  'Component Directory:'
                              )} ${selections}\n    ${chalk.white('Select:')}`,
                              type: 'string',
                              required: true,
                              message: ` please make a selection`,
                              before: val => {
                                  val = val
                                      .replace(/[^0-9\s]/g, '')
                                      .replace(/\s\s+/g, ' ')
                                      .trim();
                                  const index =
                                      Number(String(val).replace(/[^0-9]/gi)) -
                                      1;

                                  return search[index];
                              },
                          },
                      },
                  },
                  (error, input) => {
                      let directory;

                      try {
                          directory = input.directory;
                      } catch (err) {
                          directory = false;
                      }

                      if (error || directory === false) {
                          reject(error);
                      } else {
                          resolve(directory);
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
    const { from, to } = input;

    let output = {};

    Object.entries(input).forEach(([key, val]) => {
        switch (key) {
            case 'directory':
                if (val) {
                    output[key] = formatDirectory({ val, props, name: from });
                    output['destination'] = formatDirectory({
                        val,
                        props,
                        name: to,
                    });
                }
                break;

            case 'name':
                output[key] = formatName(val);
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
    console.log('Example:');
    console.log('');
    console.log('  arcli rename --old-name Fubar --new-name FooBar');
    console.log('');
};

/**
 * SCHEMA Function
 * @description used to describe the input for the prompt function.
 * @see https://www.npmjs.com/package/prompt
 * @since 2.0.0
 */
const SCHEMA = () => {
    return {
        properties: {
            from: {
                required: true,
                pattern: /[a-zA-Z]/,
                message: ' Component name is required',
                description: chalk.white('Component Name:'),
            },
            to: {
                required: true,
                pattern: /[a-zA-Z]/,
                message: ' New name is required',
                description: chalk.white('New Name:'),
            },
            replace: {
                description: `${chalk.white(
                    'Replace in other files?'
                )} ${chalk.cyan('(Y/N):')}`,
                required: true,
                pattern: /^y|n|Y|N/,
                message: ` `,
                default: 'n',
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
const ACTION = ({ opt, props }) => {
    console.log('');

    const { cwd, prompt } = props;

    const ovr = {};
    const schema = SCHEMA();

    Object.keys(schema.properties).forEach(key => {
        let val = opt[key];
        val = typeof val === 'function' ? undefined : val;

        if (val) {
            ovr[key] = val;
        }
    });

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

        SEARCH({ props, params: input })
            .then(directory => {
                input['directory'] = directory;

                const params = CONFORM({ input, props });
                const { replace } = params;

                message(`Rename component with the following options:`);

                const preflight = { ...params };
                const files = testflight({ params, props });

                console.log(
                    prettier.format(JSON.stringify(preflight), {
                        parser: 'json-stringify',
                    })
                );

                params['files'] = files;

                if (files.length > 0 && replace) {
                    const len = String(files.length).length;
                    const found = files
                        .map((file, index) => {
                            index += 1;
                            let i = chalk.cyan(pad(index, len) + '.');
                            return `  ${i} ${file}`;
                        })
                        .join('\n');

                    message('The following files will be updated:');
                    console.log(found, '\n');
                } else {
                    params['replace'] = false;
                }

                return CONFIRM({ props, params });
            })
            .then(params => {
                console.log('');

                generator({ params, props }).then(success => {
                    console.log('');
                });
            })
            .catch(err => {
                prompt.stop();
                if (err) {
                    console.log(err);
                }
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
        .option('-f, --from [from]', "Component's current name.")
        .option('-t, --to [to]', "Component's new name.")
        .option('-d, --directory [directory]', "Component's parent directory.")
        .option(
            '-r, --replace [replace]',
            'Replace the component name in other files.'
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
};
