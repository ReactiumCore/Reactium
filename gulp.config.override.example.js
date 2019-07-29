/**
 * Rename this file to gulp.config.override.js to use it.
 */

module.exports = config => {

    // Electron configuration
    config.dest.electron = 'build-electron';
    config.dest.static = 'build-electron/app/public';
    config.electron = {
        config: {
            width: 1280,
            height: 1024,
            show: false,
            title: 'App Title',
            backgroundColor: '#000000',
        },
        devtools: true,
    };

    // Disable auto launch of default browser
    config.open = false;

    return config;
};
