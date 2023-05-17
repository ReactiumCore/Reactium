// Uncomment this if you need corejs polyfills or runtime
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
import { Shell } from '@atomic-reactor/reactium-core/app/shell';
__webpack_public_path__ = window.resourceBaseUrl || '/assets/js/';

(async () => {
    try {
        await Shell();
    } catch (error) {
        const { AppError } = await import('@atomic-reactor/reactium-core/app');
        await AppError(error);
    }
})();
