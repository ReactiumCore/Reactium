'use strict';

const gulp = require('gulp');
const config = require('./.core/gulp.config')();
const webpackConfig = require('./.core/webpack.config')(config);

const { tasks } = config;

Object.entries(tasks).forEach(([name, task]) => gulp.task(name, task));
