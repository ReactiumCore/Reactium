import { save as lsSave, load as lsLoad, clear as lsClear } from 'redux-localstorage-simple';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import DevTools from 'appdir/components/DevTools';
import importDefined from './defineHelper';

/**
 * -----------------------------------------------------------------------------
 * @description Redux setup
 * -----------------------------------------------------------------------------
 */
let localizeState = true;
let initialState  = {};
if ( typeof window !== 'undefined' && 'INITIAL_STATE' in window ) {
    initialState = window.INITIAL_STATE;
    delete window.INITIAL_STATE;
}

// Make sure initial loaded state matches reducers and that
// the current route will dictate the Router state
const sanitizeInitialState = state => Object.keys(state)
.filter(s => s in allReducers)
.filter(s => s !== 'Router')
.reduce((states, key) => ({
    ...states,
    [key]: state[key],
}), {});

export default ({server = false} = {}) => {
    // Load middleware
    let middleWare = [thunk];

    // Load InitialState first from modules
    let importedStates = importDefined(allInitialStates);
    initialState = {
        ...initialState,
        ...sanitizeInitialState(importedStates),
    };

    // Get localized state and apply it
    if ( ! server ) {
        if (localizeState === true) {
            middleWare.push(lsSave());
            initialState = {
                ...initialState,
                ...sanitizeInitialState(lsLoad()),
            };
        } else {
            lsClear();
        }
    }

    const createStoreWithMiddleware = applyMiddleware(...middleWare)(createStore);

    // Combine all Top-level reducers into one
    let rootReducer = combineReducers(importDefined(allReducers));

    // Add DevTools redux enhancer in development
    let storeEnhancer = process.env.NODE_ENV === 'development' ? DevTools.instrument() : _=>_;

    // Create the store
    return createStoreWithMiddleware(rootReducer, initialState, storeEnhancer);
}
