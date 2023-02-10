// Uncomment this if you need corejs polyfills or runtime
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

let App, AppError;

(async () => {
    const mod = await import('reactium-core/app');

    App = mod.App;
    AppError = mod.AppError;

    try {
        App();
    } catch (error) {
        AppError(error);
    }

    /**
     * @description Initialize the app.
     */
    if (module.hot) {
        module.hot.accept(
            [
                '../.././.core/dependencies/index.js',
                '../.././.core/app.js',
                '../.././.core/sdk/index.js',
            ],
            () => {
                window.location.reload();
            },
        );
    }
})();
