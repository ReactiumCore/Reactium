'use strict';

const SDK = require('@atomic-reactor/reactium-sdk-core').default;
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const globby = require('globby').sync;
const rootPath = path.resolve(__dirname, '..');
const config = require('./gulp.config');
const webpackConfig = require('./webpack.config')(config);
const chalk = require('chalk');

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

SDK.Hook.runSync('gulp-config', config, webpackConfig);

const tasks = require('./gulp.tasks')(gulp, config, webpackConfig);
const taskPlaceholder = require('./get-task')(gulp);

const GulpRegistry = SDK.Utils.registryFactory(
    'GulpTasks',
    'name',
    SDK.Utils.Registry.MODES.CLEAN,
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

SDK.Hook.runSync(
    'gulp-tasks',
    GulpRegistry,
    config,
    webpackConfig,
    taskPlaceholder,
);

GulpRegistry.list.forEach(({ name, task }) => gulp.task(name, task));
