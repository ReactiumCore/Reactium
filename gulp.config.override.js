/**
 * Rename this file to gulp.config.override.js to use it.
 */

module.exports = config => {
    config.dest.electron = 'build-electron';
    config.dest.static = 'build-electron/app/public';
    config.electron = {
        config: {
            width: 1024,
            height: 768,
            show: false,
            title: 'App Title',
            backgroundColor: '#000000',
        },
        devtools: true,
    };
    config.open = false;

    return config;
};
