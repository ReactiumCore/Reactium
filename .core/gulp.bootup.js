const ReactiumGulp = require('@atomic-reactor/reactium-sdk-core').default;
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const globby = require('./globby-patch').sync;
const rootPath = path.resolve(__dirname, '..');
const config = require('./gulp.config');
const webpackConfig = require('./webpack.config')(config);
const chalk = require('chalk');

require('./reactium.log');

global.ReactiumGulp = ReactiumGulp;

ReactiumGulp.Enums.style = {
    MIXINS: -1000,
    VARIABLES: -900,
    BASE: -800,
    ATOMS: 0,
    MOLECULES: 800,
    ORGANISMS: 900,
    OVERRIDES: 1000,
};

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
