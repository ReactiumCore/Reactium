import { save as lsSave, load as lsLoad, clear as lsClear } from 'redux-localstorage-simple';
import { createStore, combineReducers } from 'redux';
import thunk, { applyMiddleware } from 'redux-super-thunk';
import DevTools from 'appdir/components/DevTools';
import loader from 'appdir/dependencies/loader';
import dependencies from 'appdir/dependencies';

const {
    allInitialStates,
    allReducers,
} = dependencies;

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
.filter(s => s in loader(allReducers))
.filter(s => s !== 'Router')
.reduce((states, key) => ({
    ...states,
    [key]: state[key],
}), {});

export default ({server = false} = {}) => {
    // Load middleware
    let middleWare = [thunk];

    // Load InitialState first from modules
    let importedStates = loader(allInitialStates);
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
                ...sanitizeInitialState(lsLoad()),
            };
        } else {
            lsClear();
        }
    }

    const createStoreWithMiddleware = applyMiddleware(...middleWare)(createStore);

    // Combine all Top-level reducers into one
    let rootReducer = combineReducers(loader(allReducers));

    // Add DevTools redux enhancer in development
    let storeEnhancer = process.env.NODE_ENV === 'development' ? DevTools.instrument() : _=>_;

    // Create the store
    return createStoreWithMiddleware(rootReducer, initialState, storeEnhancer);
}
