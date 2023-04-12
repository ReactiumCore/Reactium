// Uncomment this if you need corejs polyfills or runtime
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import { Shell } from 'reactium-core/app/shell';

__webpack_public_path__ = window.resourceBaseUrl || '/assets/js/';

(async () => {
    try {
        await Shell();
    } catch (error) {
        const { AppError } = await import('reactium-core/app');
        await AppError(error);
    }

    if (module.hot) {
        module.hot.accept(['./main.js', '../../.core/app/shell'], cause => {
            console.log(`${cause} triggered reload.`);
            window.location.reload();
        });
    }
})();
