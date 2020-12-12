import thunk from 'redux-super-thunk';
import { isBrowserWindow } from 'reactium-core/sdk';

export default (middlewares = [], isServer = false) => {
    let newMiddlewares = [
        {
            order: -1000,
            name: 'super-thunk',
            mw: thunk,
        },
    ];

    if (!isServer && isBrowserWindow()) {
        const { save: lsSave } = require('redux-local-persist');

        newMiddlewares.push({
            order: -1000,
            name: 'local-persist',
            mw: lsSave(),
        });
    }

    return [...middlewares, ...newMiddlewares];
};
