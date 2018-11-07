'use strict';

const fs = require('fs');
const gulp = require('gulp');
const config = require('./.core/gulp.config');
const webpackConfig = require('./.core/webpack.config')(config);
const defaultTasks = require('./.core/gulp.tasks')(gulp, config, webpackConfig);
const overrideTasks = fs.existsSync('./gulp.tasks.override.js')
    ? require('./gulp.tasks.override.js')(gulp, config, webpackConfig)
    : {};

const tasks = { ...defaultTasks, ...overrideTasks };
Object.entries(tasks).forEach(([name, task]) => gulp.task(name, task));
