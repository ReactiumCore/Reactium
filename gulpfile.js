'use strict';

const gulp = require('gulp');

/**
 Configs:
    If you wish to override gulp config settings for both local dev and build,
    create a gulp.config.override.js file in this directory.
    (see gulp.config.override.example.js)

    If you wish to override webpack configuration used for local dev and build,
    create a webpack.override.js file in this directory.
    (see webpack.override.example.js)
*/
const config = require('./.core/gulp.config');
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
