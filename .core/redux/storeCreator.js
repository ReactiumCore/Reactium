import { createStore, combineReducers, compose } from 'redux';
import { applyMiddleware } from 'redux-super-thunk';

const {
    allInitialStates,
    allReducers,
    allMiddleware,
    allEnhancers,
} = require('manifest').get();

import { pluginRegistration } from 'reactium-core/pluginRegistration';

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
        .filter(s => s in allReducers)
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
export default ({ server = false, registrations = noop } = {}) => {
    // Load InitialState first from modules
    let importedStates = allInitialStates;
    initialState = {
        ...sanitizeInitialState(importedStates),
        ...initialState,
    };

    let middlewares = loadDependencyStack(allMiddleware, [], server);

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
                    lsLoad({ initialState: allInitialStates }),
                ),
            };
        } else {
            lsClear();
        }
    }

    // Combine all Top-level reducers into one
    let rootReducer = combineReducers(allReducers);

    // add redux enhancers
    let enhancers = loadDependencyStack(
        allEnhancers,
        [
            {
                name: 'applyMiddleware',
                enhancer: applyMiddleware(
                    ...middlewares
                        .sort((a, b) =>
                            a.order < b.order ? -1 : a.order > b.order ? 1 : 0,
                        )
                        .map(({ mw }) => mw),
                ),
                order: 1000,
            },
        ],
        server,
    )
        .sort((a, b) => (a.order < b.order ? -1 : a.order > b.order ? 1 : 0))
        .map(({ enhancer }) => enhancer);

    // Avoid replacing existing store.
    if (store) return store;

    // Execute pre store creation callbacks
    middlewares
        .sort((a, b) => a.order - b.order)
        .filter(({ pre }) => pre)
        .forEach(({ pre }) => pre({ initialState, rootReducer, enhancers }));

    // Create the store
    store = compose(...enhancers)(createStore)(rootReducer, initialState);

    // Execute post store creation callbacks
    middlewares
        .sort((a, b) => a.order - b.order)
        .filter(({ post }) => post)
        .forEach(({ post }) => post({ store }));

    // Allow plugins the ability to interact with store directly
    pluginRegistration.setStore({ store, allReducers, middlewares });

    return store;
};
