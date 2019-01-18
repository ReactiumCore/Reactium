import {
    save as lsSave,
    load as lsLoad,
    clear as lsClear,
} from 'redux-local-persist';
import { createStore, combineReducers, compose } from 'redux';
import { applyMiddleware } from 'redux-super-thunk';

const {
    allInitialStates,
    allReducers,
    allMiddleware,
    allEnhancers,
} = require('manifest').get();

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

export default ({ server = false } = {}) => {
    // Initialize middlewares and enhancers
    let middlewares = [];
    let enhancers = [];

    // Load InitialState first from modules
    let importedStates = allInitialStates;
    initialState = {
        ...sanitizeInitialState(importedStates),
        ...initialState,
    };

    middlewares = loadDependencyStack(allMiddleware, middlewares, server);

    // Get localized state and apply it
    if (!server) {
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

    const createStoreWithMiddleware = applyMiddleware(
        ...middlewares.sort((a, b) => a.order - b.order).map(({ mw }) => mw),
    )(createStore);

    // Combine all Top-level reducers into one
    let rootReducer = combineReducers(allReducers);

    // add redux enhancers
    enhancers = loadDependencyStack(allEnhancers, enhancers, server)
        .sort((a, b) => a.order - b.order)
        .map(({ enhancer }) => enhancer);

    // Avoid replacing existing store.
    if (store) return store;

    // Execute pre store creation callbacks
    middlewares
        .sort((a, b) => a.order - b.order)
        .filter(({ pre }) => pre)
        .forEach(({ pre }) => pre({ initialState, rootReducer, enhancers }));

    // Create the store
    store = createStoreWithMiddleware(
        rootReducer,
        initialState,
        compose(...enhancers),
    );

    // Execute post store creation callbacks
    middlewares
        .sort((a, b) => a.order - b.order)
        .filter(({ post }) => post)
        .forEach(({ post }) => post({ store }));

    return store;
};
