const gulp = require('gulp');
const gulpTasks = require('./gulp.tasks');
const gulpwatch = require('gulp-watch');
const task = require('./get-task')(gulp);

process.on('message', ({ config, webpackConfig, restart }) => {
    const tasks = gulpTasks(gulp, config, webpackConfig);
    Object.entries(tasks).forEach(([name, task]) => gulp.task(name, task));

    const asyncDone = done => {
        process.send('build-started');
        done();
    };

    const asyncBuild = gulp.series(
        task('build'),
        task('watchFork'),
        restart ? task('serve-restart') : task('serve'),
        task('postServe'),
        asyncDone,
    );

    gulp.task('asyncBuild', asyncBuild);
    gulp.task('asyncBuild')();

    gulpwatch(config.watch.restartWatches, () => {
        process.send('restart-watches');
    });
});
