import 'core-js/modules/es6.string.starts-with';
import 'core-js/modules/es7.object.entries.js';
import { App, AppError } from 'reactium-core/app';

let render = App;

/**
 * @description Initialize the app.
 */
if (module.hot) {
    render = () => {
        try {
            App();
        } catch (error) {
            AppError(error);
        }
    };

    module.hot.accept(
        ['../.././.core/dependencies/index.js', '../.././.core/app.js'],
        () => {
            window.location.reload();
        },
    );
}

render();
