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
})();
