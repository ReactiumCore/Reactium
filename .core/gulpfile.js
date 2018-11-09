'use strict';

const fs = require('fs');
const gulp = require('gulp');
const config = require('./gulp.config');
const webpackConfig = require('./webpack.config')(config);
const tasks = require('./gulp.tasks')(gulp, config, webpackConfig);

Object.entries(tasks).forEach(([name, task]) => gulp.task(name, task));
