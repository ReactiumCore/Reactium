import thunk from 'redux-super-thunk';

export default (middlewares = [], isServer = false) => {
    let newMiddlewares = [
        {
            order: -1000,
            name: 'super-thunk',
            mw: thunk,
        },
    ];

    if (!isServer && typeof window !== 'undefined') {
        const { save: lsSave } = require('redux-local-persist');

        newMiddlewares.push({
            order: -1000,
            name: 'local-persist',
            mw: lsSave(),
        });
    }

    return [...middlewares, ...newMiddlewares];
};
