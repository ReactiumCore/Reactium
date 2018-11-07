import { App, AppError } from 'reactium-core/app';
import { combineReducers } from 'redux';

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
        (...params) => {
            window.location.reload();
        }
    );
}

render();
