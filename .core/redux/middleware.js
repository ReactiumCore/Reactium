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

    return [...middlewares, ...newMiddlewares];
};
