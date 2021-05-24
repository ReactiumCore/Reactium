const gulp = require('gulp');
const gulpTasks = require('./gulp.tasks');
const gulpwatch = require('@atomic-reactor/gulp-watch');
const task = require('./get-task')(gulp);

process.on('message', ({ config, webpackConfig, restart }) => {
    require('./gulp.bootup');

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
