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

const formatDestination = (val, props) => {
    const { cwd } = props;

    val = path.normalize(val);
    val = String(val).replace(/^~\/|^\/cwd\/|^cwd\/|^cwd$/i, `${cwd}/`);
    return path.normalize(val);
};

const NAME = 'electron-run';

const DESC = 'Run the UI and Electron app locally';

const CANCELED = 'Run canceled!';

const HELP = () =>
    console.log(`
Example:
  $ arcli electron-run
  $ arcli electorn-run -e cwd/my/path -u cwd/other/path

** Note: by default the ${chalk.cyan(
        path.join(__dirname, '..', '..', '..', 'electron.js'),
    )} and ${chalk.cyan(
        path.join(__dirname, '..', '..', '..', 'gulpfile.js'),
    )} are used.
`);

const FLAGS = ['electron', 'ui'];

const FLAGS_TO_PARAMS = ({ opt = {} }) =>
    FLAGS.reduce((obj, key) => {
        let val = opt[key];
        val = typeof val === 'function' ? undefined : val;

        if (val) {
            obj[key] = val;
        }

        return obj;
    }, {});

const CONFORM = ({ input, props }) => {
    const { cwd } = props;

    let output = {};

    Object.entries(input).forEach(([key, val]) => {
        switch (String(key).toLowerCase()) {
            case 'electron':
            case 'ui':
                output[key] = formatDestination(val, props);
                break;

            default:
                output[key] = val;
        }
    });

    return output;
};

const SCHEMA = ({ props }) => {
    return {
        properties: {
            electron: {
                description: chalk.white('Electron Path:'),
                default: 'cwd/build-electron/main.js',
            },
            ui: {
                description: chalk.white('UI Path:'),
                default: 'cwd',
            },
        },
    };
};

const ACTION = ({ opt, props }) => {
    const { cwd, prompt } = props;
    const schema = SCHEMA({ props });
    const ovr = FLAGS_TO_PARAMS({ opt });

    prompt.override = ovr;
    prompt.start();

    let params;

    return new Promise((resolve, reject) => {
        prompt.get(schema, (err, input = {}) => {
            if (err) {
                prompt.stop();
                reject(`${NAME} ${err.message}`);
                return;
            }

            input = { ...ovr, ...input };

            params = CONFORM({ input, props });

            resolve(params);
        });
    })
        .then(async () => {
            console.log('');
            await generator({ params, props });
            console.log('');
        })
        .then(() => prompt.stop())
        .catch(err => {
            prompt.stop();
            console.log(err);
        });
};

const COMMAND = ({ program, props }) =>
    program
        .command(NAME)
        .description(DESC)
        .action(opt => ACTION({ opt, props }))
        .option('-u, --ui [ui]', 'UI Path.')
        .option('-e, --electron [electron]', 'Electron Path.')
        .on('--help', HELP);

module.exports = {
    COMMAND,
    NAME,
};
