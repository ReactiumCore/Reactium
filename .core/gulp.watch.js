const gulp = require('gulp');
const gulpTasks = require('./gulp.tasks');
const runSequence = require('run-sequence');
const gulpwatch = require('gulp-watch');

process.on('message', ({ config, webpackConfig, restart }) => {
    const tasks = gulpTasks(gulp, config, webpackConfig);
    Object.entries(tasks).forEach(([name, task]) => gulp.task(name, task));

    console.log("[00:00:00] Starting 'build'...");
    runSequence(
        ['build'],
        ['watchFork'],
        [restart ? 'serve-restart' : 'serve'],
        ['postServe'],
        () => {
            process.send('build-started');
        },
    );

    gulpwatch(config.watch.restartWatches, () => {
        process.send('restart-watches');
    });
});
