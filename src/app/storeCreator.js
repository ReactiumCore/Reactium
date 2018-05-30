import { save as lsSave, load as lsLoad, clear as lsClear } from 'redux-localstorage-simple';
import { createStore, combineReducers } from 'redux';
import thunk, { applyMiddleware } from 'redux-super-thunk';
import DevTools from 'components/DevTools';
import moment from 'moment';

const {
    allInitialStates,
    allReducers,
} = require('manifest').get();

/**
 * -----------------------------------------------------------------------------
 * @description Redux setup
 * -----------------------------------------------------------------------------
 */
let localStorageExpirationSecs = 3600;
let localizeState = true;
let initialState  = {};
if ( typeof window !== 'undefined' ) {
    if ( 'INITIAL_STATE' in window ) {
        initialState = window.INITIAL_STATE;
        delete window.INITIAL_STATE;
    }

    if ( 'LOCAL_STORAGE_EXPIRATION_SECS' in window ) {
        localStorageExpirationSecs = window.LOCAL_STORAGE_EXPIRATION_SECS;
    }
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

let store = {};

const getLoadedState = () => {
    const loadedState = lsLoad();
    const expired = loadedState.timeStamp && moment().diff(moment(loadedState.timeStamp), 'seconds', true) >= localStorageExpirationSecs;
    return expired ? {} : loadedState;
};

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
                ...sanitizeInitialState(getLoadedState()),
            };
        } else {
            lsClear();
        }
    }

    const createStoreWithMiddleware = applyMiddleware(...middleWare)(createStore);

    if (localizeState) {
        allReducers.timeStamp = (state = moment().toISOString()) => state;
    }

    // Combine all Top-level reducers into one
    let rootReducer = combineReducers(allReducers);

    // Add DevTools redux enhancer in development
    let storeEnhancer = process.env.NODE_ENV === 'development' ? DevTools.instrument() : _=>_;

    // Create the store
    store = createStoreWithMiddleware(rootReducer, initialState, storeEnhancer);

    return store;
}
