const ReactiumGulp = require('@atomic-reactor/reactium-sdk-core').default;
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const globby = require('./globby-patch').sync;
const rootPath = path.resolve(__dirname, '..');
const config = require('./gulp.config');
const webpackConfig = require('./webpack.config')(config);
const chalk = require('chalk');
const op = require('object-path');
const moment = require('moment');

global.LOG_LEVELS = {
    DEBUG: 1000,
    INFO: 500,
    BOOT: 0,
    WARN: -500,
    ERROR: -1000,
};

global.LOG_LEVEL = op.get(
    LOG_LEVELS,
    op.get(process.env, 'LOG_LEVEL', 'BOOT'),
    LOG_LEVELS.BOOT,
);

const APP_NAME = op.get(process.env, 'APP_NAME', 'Reactium');
const LOG_THRESHOLD = op.get(LOG_LEVELS, [LOG_LEVEL], LOG_LEVELS.BOOT);

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

        const time = `[${chalk.magenta(moment().format('HH:mm:ss'))}]`;
        let name = `${color(String(APP_NAME))}`;
        name = _E ? `%${name}%` : _W ? `!${name}!` : `[${name}]`;

        let logMethod = op.get(reactiumConsole, LEVEL, reactiumConsole.log);
        logMethod =
            typeof logMethod === 'function' ? logMethod : reactiumConsole.log;
        const [first, ...remaining] = args;

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

global.ReactiumGulp = ReactiumGulp;

// Load reactium-gulp DDD artifact from plugin sources
globby([
    `${rootPath}/.core/**/reactium-gulp.js`,
    `${rootPath}/src/**/reactium-gulp.js`,
    `${rootPath}/reactium_modules/**/reactium-gulp.js`,
    `${rootPath}/node_modules/**/reactium-plugin/**/reactium-gulp.js`,
]).forEach(item => {
    const p = path.normalize(item);
    try {
        require(p);
    } catch (error) {
        console.error(chalk.red(`Error loading ${p}:`));
        console.error(error);
    }
});

ReactiumGulp.Hook.runSync('config', config, webpackConfig);

const tasks = require('./gulp.tasks')(gulp, config, webpackConfig);
const taskPlaceholder = require('./get-task')(gulp);

const GulpRegistry = ReactiumGulp.Utils.registryFactory(
    'GulpTasks',
    'name',
    ReactiumGulp.Utils.Registry.MODES.CLEAN,
);

GulpRegistry.unregister = name => {
    GulpRegistry.register(name, {
        name,
        task: () => Promise.resolve(),
    });
};

Object.entries(tasks).forEach(([name, task]) => {
    GulpRegistry.register(name, {
        name,
        task,
    });
});

ReactiumGulp.Hook.runSync(
    'tasks',
    GulpRegistry,
    config,
    webpackConfig,
    taskPlaceholder,
);

GulpRegistry.list.forEach(({ name, task }) => gulp.task(name, task));
