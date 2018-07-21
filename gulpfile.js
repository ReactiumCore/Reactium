'use strict';

const gulp = require('gulp');

/**
 Configs:
   To customize config, load your own gulp.config.js and/or webpack.config.js
   files and/or edit the config and webpackConfig property after loading the defaults.

   @example
   // Load alt file
   const config = require('../path/to/my/gulp.config');
   const webpackConfig = require('../path/to/my/webpack.config');

   // Direct property edit
   config.port.proxy = 3030;
   webpackConfig.output.path = path.resolve(__dirname, '/my/new/path');
*/
const config = require('./.core/gulp.config')();
const webpackConfig = require('./.core/webpack.config')(config);

/**
 Default Reactium Tasks:
  'assets', 'build', 'clean', 'default', 'manifest', 'markup',
  'scripts', 'serve', 'static', 'static:copy', 'styles', 'watch'

  Replace a task by re-assigning the task with your own.

  @example
  tasks['default'] = (done) => {
     if (env === "development") {
          runSequence(["build"], ["watch"], () => {
              gulp.start("serve");
              done();
          });
      } else {
          runSequence(["build"], () => {
              done();
          });
      }
   }
*/
const tasks = require('./.core/gulp.tasks')(gulp, config, webpackConfig);
Object.keys(tasks).forEach(task => {
    gulp.task(task, tasks[task]);
});

/**
 Custom Tasks:
   You can add your gulp.tasks() here.
*/
