import Reactium from 'reactium-core/sdk';
import { createStore, combineReducers, compose } from 'redux';
import { applyMiddleware } from 'redux-super-thunk';
import { manifest } from 'dependencies';
import _ from 'underscore';

let store;

/**
 * -----------------------------------------------------------------------------
 * @description Redux setup
 * -----------------------------------------------------------------------------
 */
let localizeState = true;
let initialState = {};
if (typeof window !== 'undefined') {
    if ('INITIAL_STATE' in window) {
        initialState = window.INITIAL_STATE;
        delete window.INITIAL_STATE;
    }
}

// Make sure initial loaded state matches reducers
const sanitizeInitialState = state =>
    Object.keys(state)
        .filter(s => s in manifest.allReducers)
        .reduce(
            (states, key) => ({
                ...states,
                [key]: state[key],
            }),
            {},
        );

const loadDependencyStack = (dependency, items, isServer) => {
    return Object.keys(dependency).reduce(
        (items, key) => dependency[key](items, isServer),
        items,
    );
};

const noop = cb => {};
const storeCreator = async ({ server = false } = {}) => {
    // Avoid replacing existing store.
    if (store) return store;

    // Load InitialState first from modules
    let importedStates = manifest.allInitialStates;
    initialState = {
        ...sanitizeInitialState(importedStates),
        ...initialState,
    };

    let middlewares = loadDependencyStack(manifest.allMiddleware, [], server);

    // Get localized state and apply it
    if (!server && typeof window !== 'undefined') {
        const {
            save: lsSave,
            load: lsLoad,
            clear: lsClear,
        } = require('redux-local-persist');

        if (middlewares.find(mw => mw.name === 'local-persist')) {
            initialState = {
                ...initialState,
                ...sanitizeInitialState(
                    lsLoad({ initialState: manifest.allInitialStates }),
                ),
            };
        } else {
            lsClear();
        }
    }

    // Combine all Top-level reducers into one
    let rootReducer = combineReducers(manifest.allReducers);

    // add redux enhancers
    let enhancers = _.sortBy(
        loadDependencyStack(
            manifest.allEnhancers,
            [
                {
                    name: 'applyMiddleware',
                    enhancer: applyMiddleware(
                        ..._.sortBy(middlewares, 'order').map(({ mw }) => mw),
                    ),
                    order: 1000,
                },
            ],
            server,
        ),
        'order',
    ).map(({ enhancer }) => enhancer);

    // Create the store
    store = compose(...enhancers)(createStore)(rootReducer, initialState);

    // Allow plugins the ability to interact with store directly
    await Reactium.Hook.run('store-created', {
        store,
        allReducers: manifest.allReducers,
        middlewares,
    });

    return store;
};

Reactium.Hook.register(
    'store-create',
    async (config, context) => {
        context.store = await storeCreator(config);
        console.log('Redux store created.');
        return Promise.resolve();
    },
    Reactium.Enums.priority.highest,
);
