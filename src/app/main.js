import 'babel-polyfill';
import { App } from 'reactium-core/app';

/**
 * @description Initialize the app.
 */
App();

// Can not get HMR working, so this is a cheap-out
if ( module.hot ) {
    module.hot.accept('../.././.core/app.js', () => {
        window.location.reload();
    });
}
