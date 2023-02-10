// Uncomment this if you need corejs polyfills or runtime
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import { Shell } from 'reactium-core/app/shell';

(async () => {
    try {
        await Shell();
    } catch (error) {
        const { AppError } = await import('reactium-core/app');
        await AppError(error);
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
