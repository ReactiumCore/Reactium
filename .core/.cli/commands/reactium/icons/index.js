/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const path = require('path');
const chalk = require('chalk');
const _ = require('underscore');
const op = require('object-path');
const prettier = require('prettier');
const camelcase = require('camelcase');
const generator = require('./generator');
const mod = path.dirname(require.main.filename);
const { error, message } = require(`${mod}/lib/messenger`);

const formatDestination = (val, props) => {
    const { cwd } = props;

    val = path.normalize(val);

    val = String(val).replace(/^\/cwd\/|^cwd\/|^cwd$/i, `${cwd}/`);
    val = String(val).replace(
        /^\/icon|^\/icon\/|^icon\/|^icon$/i,
        `${cwd}/src/app/components/common-ui/Icon/`,
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

const NAME = 'icons';

const DESC = 'Reactium: Import icons from an Icomoon selection file.';

const CANCELED = 'Action canceled!';

const CONFORM = ({ input, props }) =>
    Object.keys(input).reduce((obj, key) => {
        let val = input[key];
        switch (key) {
            case 'destination':
                val = path.join(
                    val,
                    camelcase(input.name, { pascalCase: true }),
                );
                obj[key] = formatDestination(val, props);
                break;

            case 'source':
                obj[key] = formatDestination(val, props);
                break;

            default:
                obj[key] = val;
                break;
        }

        return obj;
    }, {});

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
                            return String(val).toLowerCase() === 'y';
                        },
                    },
                },
            },
            (error, input = {}) => {
                const confirmed = op.get(input, 'confirmed', false);
                if (error || confirmed === false) {
                    console.log('');
                    reject(error);
                } else {
                    params['confirmed'] = true;
                    console.log('');
                    resolve(params);
                }
            },
        );
    });
};

const HELP = props =>
    console.log(`
Example:
  $ arcli icon-import -d common-ui/Icon/icons.js

When specifying the [${chalk.cyan('-d')}, ${chalk.cyan(
        '--destination',
    )}] or [${chalk.cyan('-s')}, ${chalk.cyan(
        '--source',
    )}] value you can use the following short cuts:
  ${chalk.cyan('components')} ${chalk.magenta('→')} ${chalk.cyan(
        path.normalize(props.cwd + '/src/app/components'),
    )} directory.
  ${chalk.cyan('common-ui ')} ${chalk.magenta('→')} ${chalk.cyan(
        path.normalize(props.cwd + '/src/app/components/common-ui'),
    )} directory.
  ${chalk.cyan('icon      ')} ${chalk.magenta('→')} ${chalk.cyan(
        path.normalize(props.cwd + '/src/app/components/common-ui/Icon'),
    )} directory.
  ${chalk.cyan('cwd       ')} ${chalk.magenta('→')} ${chalk.cyan(
        path.normalize(props.cwd),
    )} directory.
`);

const FLAGS = ['destination', 'name', 'source'];

const FLAGS_TO_PARAMS = ({ opt = {} }) =>
    FLAGS.reduce((obj, key) => {
        let val = opt[key];
        val = typeof val === 'function' ? undefined : val;

        if (val) {
            obj[key] = val;
        }

        return obj;
    }, {});

const PREFLIGHT = ({ params }) => {
    const msg =
        'A new icon package will be create witht the following options:';
    const preflight = _.pick(params, ...Object.keys(params).sort());

    message(msg);

    console.log(
        prettier.format(JSON.stringify(preflight), {
            parser: 'json-stringify',
        }),
    );
};

const SCHEMA = () => {
    //const { cwd, prompt } = props;

    return {
        properties: {
            name: {
                required: true,
                message: ' Name is required',
                description: chalk.white('Name:'),
            },
            destination: {
                required: true,
                message: ' Destination is required',
                description: chalk.white('Destination:'),
                default: '/icon',
            },
            source: {
                required: true,
                message: ' Source is required',
                description: chalk.white('Source:'),
            },
        },
    };
};

const ACTION = ({ opt, props }) => {
    let params;
    const { cwd, prompt } = props;
    const schema = SCHEMA({ props });
    const ovr = FLAGS_TO_PARAMS({ opt });

    prompt.override = ovr;
    prompt.start();

    return new Promise((resolve, reject) => {
        prompt.get(schema, (err, input = {}) => {
            if (err) {
                prompt.stop();
                reject(`${NAME} ${err.message}`);
                return;
            }

            input = { ...ovr, ...input };
            params = CONFORM({ input, props });

            PREFLIGHT({ params, props });

            resolve(params);
        });
    })
        .then(params => CONFIRM({ props, params }))
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

const COMMAND = ({ program, props }) =>
    program
        .command(NAME)
        .description(DESC)
        .action(opt => ACTION({ opt, props }))
        .option(
            '-d, --destination [destination]',
            'Destination. Example: /common-ui/Icon',
        )
        .option(
            '-s, --source [source]',
            'Source File. Example: /cwd/icons.json',
        )
        .option('-n, --name [name]', 'Name of the icon package.')
        .on('--help', () => HELP(props));

module.exports = {
    COMMAND,
    NAME,
};
