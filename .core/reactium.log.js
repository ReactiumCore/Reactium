const op = require('object-path');
const dayjs = require('dayjs');
const chalk = require('chalk');

global.LOG_LEVELS = {
    DEBUG: 1000,
    INFO: 500,
    BOOT: 0,
    WARN: -500,
    ERROR: -1000,
};

global.LEVEL_FUNCTIONS = {
    DEBUG: 'log',
    INFO: 'log',
    BOOT: 'log',
    WARN: 'warn',
    ERROR: 'error',
};

global.LOG_LEVEL_STRING = op.get(process.env, 'LOG_LEVEL', 'BOOT');
global.LOG_LEVEL = op.get(LOG_LEVELS, LOG_LEVEL_STRING, LOG_LEVELS.BOOT);

const APP_NAME = op.get(process.env, 'APP_NAME', 'Reactium');
const LOG_THRESHOLD = op.get(LOG_LEVELS, [LOG_LEVEL_STRING], LOG_LEVELS.BOOT);

const reactiumConsole = global.console;
for (const [LEVEL, THRESHOLD] of Object.entries(LOG_LEVELS)) {
    global[LEVEL] = (...args) => {
        if (process.env.NO_LOGGING === 'true' || THRESHOLD > LOG_THRESHOLD) {
            return;
        }

        const _W = THRESHOLD <= LOG_LEVELS.WARN;
        const _E = THRESHOLD <= LOG_LEVELS.ERROR;
        let color = _W ? chalk.yellow.bold : chalk.cyan;
        color = _E ? chalk.red.bold : color;

        const time = `[${chalk.magenta(dayjs().format('HH:mm:ss'))}]`;
        let name = `${color(String(APP_NAME))}`;
        name = _E ? `%${name}%` : _W ? `!${name}!` : `[${name}]`;

        const [first, ...remaining] = args;
        const logMethod =
            op.get(
                reactiumConsole,
                [op.get(LEVEL_FUNCTIONS, [LEVEL], 'log')],
                reactiumConsole.log,
            ) || reactiumConsole.log;

        if (typeof first === 'string') {
            logMethod(`${time} ${name} ${first}`, ...remaining);
        } else {
            logMethod(time, name, ...args);
        }
    };
}

global.console = {
    log: global.BOOT,
    warn: global.WARN,
    error: global.ERROR,
    info: global.BOOT,
};

global.LOG = global.BOOT;
