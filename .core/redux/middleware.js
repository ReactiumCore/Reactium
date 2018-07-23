import thunk from 'redux-super-thunk';
import { save as lsSave } from 'redux-local-persist';

export default (middlewares = [], isServer = false) => {
    let newMiddlewares = [
        {
            order: -1000,
            name: 'super-thunk',
            mw: thunk
        }
    ];

    if (!isServer) {
        newMiddlewares.push({
            order: -1000,
            name: 'local-persist',
            mw: lsSave()
        });
    }

    return [...middlewares, ...newMiddlewares];
};
