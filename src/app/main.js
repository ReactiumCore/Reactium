// Uncomment this if you need corejs polyfills or runtime
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
import { Shell } from '@atomic-reactor/reactium-core/app/shell';

(async () => {
    try {
        await Shell();
    } catch (error) {
        const { AppError } = await import('@atomic-reactor/reactium-core/app');
        await AppError(error);
    }

    /**
     * @description Initialize the app.
     */
    if (module.hot) {
        module.hot.accept(
            [
                '../../reactium_modules/@atomic-reactor/reactium-core/dependencies/index.js',
                '../../reactium_modules/@atomic-reactor/reactium-core/app.js',
                '../../reactium_modules/@atomic-reactor/reactium-core/sdk/index.js',
            ],
            () => {
                window.location.reload();
            },
        );
    }
})();
