import 'babel-polyfill';
import { App } from './app';

/**
 * @description Initialize the app.
 */
App();

// Can not get HMR working, so this is a cheap-out
if ( module.hot ) {
    const reload = () => window.location.reload(true);

    module.hot.addStatusHandler(status => {
        if ( module.hot.status() === 'apply' ) {
            reload();
        }
    });
}
