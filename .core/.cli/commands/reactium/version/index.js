const chalk = require('chalk');
const path = require('path');
const op = require('object-path');

const NAME = 'version';
const DESC = 'The current Reactium Core version';

const ACTION = ({ opt, props }) => {
    const configPath = path.normalize(
        path.join(props.cwd, '/.core', 'reactium-config'),
    );
    const reactiumConfig = require(configPath);
    console.log(chalk.cyan('Reactium:'));
    console.log(
        ' ',
        'Version:',
        chalk.magenta(op.get(actiniumConfig, 'version')),
    );
    console.log(
        ' ',
        'Semver: ',
        chalk.magenta(op.get(actiniumConfig, 'semver')),
    );
    console.log('');
};

const COMMAND = ({ program, props }) =>
    program
        .command(NAME)
        .description(DESC)
        .action(opt => ACTION({ opt, props }));

module.exports = {
    COMMAND,
    NAME,
};
