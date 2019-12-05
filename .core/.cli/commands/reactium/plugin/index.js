const chalk = require('chalk');
const op = require('object-path');

const NAME = 'plugin';
const DESC = 'Reactium: Commands used to help manage plugins.';

const HELP = props => {
    const actions = Object.keys(props.subcommands[NAME]);
    actions.sort();

    console.log('');
    console.log('Actions:');
    console.log(' ', actions.map(act => chalk.cyan(act)).join(', '));
    console.log('');
    console.log('Example:');
    actions.forEach(act =>
        console.log(`  $ arcli`, chalk.magenta(NAME), chalk.cyan(act), '-h'),
    );
    console.log('');
};

const COMMAND = ({ program, props }) => {
    const ACT = props.args[3];
    const { subcommands = {} } = props;

    if (NAME === props.args[2] && ACT) {
        if (!op.has(subcommands, `${NAME}.${ACT}`)) {
            console.log('');
            console.log(chalk.red('Invalid command:'), NAME, chalk.cyan(ACT));
            console.log('');
            process.exit();
        }
        return subcommands[NAME][ACT]['COMMAND']({ program, props });
    } else {
        return program
            .command(`${NAME} <action>`)
            .description(DESC)
            .action((action, opt) => {})
            .on('--help', () => HELP(props));
    }
};

module.exports = {
    COMMAND,
    NAME,
};
