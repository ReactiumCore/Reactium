
import { save as lsSave, load as lsLoad, clear as lsClear } from 'redux-local-persist';

import { createStore, combineReducers } from 'redux';
import thunk, { applyMiddleware } from 'redux-super-thunk';
import DevTools from 'reactium-core/components/DevTools';

const {
    allInitialStates,
    allReducers,
} = require('manifest').get();

/**
 * -----------------------------------------------------------------------------
 * @description Redux setup
 * -----------------------------------------------------------------------------
 */
let localizeState = true;
let initialState  = {};
if ( typeof window !== 'undefined' ) {
    if ( 'INITIAL_STATE' in window ) {
        initialState = window.INITIAL_STATE;
        delete window.INITIAL_STATE;
    }
}

// Make sure initial loaded state matches reducers
const sanitizeInitialState = state => Object.keys(state)
.filter(s => s in allReducers)
.reduce((states, key) => ({
    ...states,
    [key]: state[key],
}), {});

let store = {};

export default ({server = false} = {}) => {
    // Load middleware
    let middleWare = [thunk];

    // Load InitialState first from modules
    let importedStates = allInitialStates;
    initialState = {
        ...sanitizeInitialState(importedStates),
        ...initialState,
    };

    // Get localized state and apply it
    if ( ! server ) {
        if (localizeState === true) {
            middleWare.push(lsSave());
            initialState = {
                ...initialState,
                ...sanitizeInitialState(lsLoad({initialState: allInitialStates})),
            };
        } else {
            lsClear();
        }
    }

    const createStoreWithMiddleware = applyMiddleware(...middleWare)(createStore);


    // Combine all Top-level reducers into one
    let rootReducer = combineReducers(allReducers);

    // Add DevTools redux enhancer in development
    let storeEnhancer = process.env.NODE_ENV === 'development' ? DevTools.instrument() : _=>_;

    // Create the store
    store = createStoreWithMiddleware(rootReducer, initialState, storeEnhancer);

    return store;
}
