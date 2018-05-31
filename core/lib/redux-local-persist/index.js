import moment from 'moment';
import op from 'object-path';

const RLP = {
    DELIMITER : '.',
    NS        : 'rlp',
};

// Check if a var is an Object
const isObject = (o) => {
    return o instanceof Object && o.constructor === Object;
};


// Save state to localStorage
export const save = () => store => next => action => {

    next(action);

    let state  = store.getState();
    let newState = {};
    let expires  = {};

    Object.keys(state).forEach((key) => {

        // Get the state value
        let obj = state[key];

        let { persist = false } = obj;

        // Exit if we don't want to persist this state
        if (persist === false) { return; }

        // Save all props w/o expiration
        if (persist === true) {
            newState[key] = obj;
            return;
        }

        // Save all props w/ expiration
        if (typeof persist === 'number') {
            let when = Number(persist);
            if (when !== 0) { expires[key]  = moment().add(when).toISOString(); }
            newState[key] = obj;
            return;
        }

        // Save multiple expirations
        if (isObject(persist)) {

            Object.keys(persist).forEach((k) => {
                let when = Number(persist[k]);
                if (when === 0) { return; }

                expires[`${key}.${k}`] = moment().add(when).toISOString();
            });

            persist = Object.keys(persist);
        }

        // Save a single prop but turn it into an array anyway
        if (typeof persist === 'string') {
            persist = [persist];
        }

        // Save multiple props w/o expiration
        if (Array.isArray(persist)) {

            persist.forEach((item) => {
                let val = op.get(obj, item);
                op.set(newState, `${key}.${item}`, val);
            });

            newState[key]['persist'] = obj['persist'];
        }
    });

    localStorage.setItem(`${RLP.NS}-state`, JSON.stringify(newState));
    localStorage.setItem(`${RLP.NS}-expire`, JSON.stringify(expires));
};


// Load state from localStorage
export const load = ({initialState = {}}) => {

    // Get the localStorage state
    let state    = localStorage.getItem(`${RLP.NS}-state`) || '{}';
        state    = JSON.parse(state);

    // Get the localStorage expires
    let expires  = localStorage.getItem(`${RLP.NS}-expire`) || '{}';
        expires  = JSON.parse(expires);

    // Only validate if expires.length > 0
    if (Object.keys(expires).length > 0) {
        let newState = {...state};

        Object.keys(expires).forEach((k) => {
            let exp  = moment(expires[k]);
            let diff = moment().diff(exp);

            // If the value is expired -> load the initialState version
            let val = (diff > 0) ? op.get(initialState, k) : op.get(state, k);
            op.set(newState, k, val);
        });

        return newState;

    } else {
        return state;
    }
};

// Clear stored state and expires
export const clear = () => {
    localStorage.removeItem(`${RLP.NS}-state`);
    localStorage.removeItem(`${RLP.NS}-expire`);
};
