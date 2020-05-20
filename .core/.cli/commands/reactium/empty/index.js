/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const path = require('path');
const generator = require('./generator');
const mod = path.dirname(require.main.filename);

const NAME = 'empty';

const DESC = 'Reactium: Remove Reactium demo pages, components, and toolkit.';

const CONFORM = ({ input, props }) => {
    const { cwd } = props;

    let output = {};

    Object.entries(input).forEach(([key, val]) => {
        switch (key) {
            default:
                output[key] = val;
                break;
        }
    });

    if (!Object.entries(output).length) {
        output = {
            demo: true,
            font: true,
            images: true,
            style: true,
            toolkit: true,
        };
    }

    return output;
};

const HELP = () => {
    console.log('');
    console.log('Usage:');
    console.log('');
    console.log(' Keep the default toolkit:');
    console.log('  $ arcli reactium empty -FITD');
    console.log('');
    console.log(' Keep the demo site:');
    console.log('  $ arcli reactium empty -FIST');
    console.log('');
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

    const ovr = ['demo', 'font', 'images', 'style', 'toolkit'].reduce(
        (obj, key) => {
            let val = opt[key];
            val = typeof val === 'function' ? null : val;
            if (val) {
                obj[key] = val;
            }
            return obj;
        },
        {},
    );

    const params = CONFORM({ input: ovr, props });

    generator({ params, props });
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
        .option('-F, --font', 'Empty ~/src/assets/fonts directory.')
        .option('-I, --images', 'Empty ~/src/assets/images directory.')
        .option('-S, --style', 'Empty ~/src/assets/style/style.scss file.')
        .option('-T, --toolkit', 'Empty toolkit elements.')
        .option('-D, --demo', 'Empty the demo.')
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
    CONFORM,
    COMMAND,
    NAME,
};
