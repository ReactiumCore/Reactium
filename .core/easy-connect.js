import { useContext, useState, useEffect } from 'react';
import { connect, ReactReduxContext } from 'react-redux';
import op from 'object-path';
import _ from 'underscore';

const noop = () => {};

/**
 * An "easy connect" helper for redux.
 * A simple wrapper for react-redux connect.
 * Provides getState and dispatch from store using connect HoC
 *
 * @example
 * import { ec } from 'reactium-core/easy-connect';
 * import MyComponent from './MyComponent';
 *
 * // MyComponent exported from here will have props getState and dispatch
 * // off the redux store
 * export default ec(MyComponent);
 */
export const ec = Component => {
    return connect(state => ({
        ...op.get(state, Component.name, {}),
        getState: () => state,
    }))(Component);
};

/**
 * useStore hook - just gimme the store damnit!
 * Custom React hooks for accessing store or specific data from the store.
 * @return {Object} The redux store.
 */
export const useStore = () =>
    op.get(useContext(ReactReduxContext), 'store', {
        getState: () => ({}),
        subscribe: noop,
        dispatch: noop,
    });

/**
 * useSelect hook - subscribe to subtree of redux and control updates.
 * @description select subtree from redux state, and govern when to inform component of changes.
 * @param select [Function] select function is passed the full redux state, returns your
 * custom derived object / substate.
 * @param shouldUpdate [Function] passed object with newState and prevState.
 * @param debounce [Boolean] (false) debounce updates if true
 * @param wait [Integer] (250) if debounce is true, this is number of milliseconds before taking a value
 * Returns true if state should be updated in hook.
 */
export const useSelect = ({
    select = newState => newState,
    shouldUpdate = ({ prevState, nextState }) => true,
    debounce = false,
    wait = 250,
}) => {
    const { getState, subscribe } = useStore();
    const [value, setValue] = useState(select(getState()));

    useEffect(() => {
        let handleStateChange = () => {
            const newState = select(getState());
            const prevState = value;

            if (
                shouldUpdate({
                    newState,
                    prevState,
                })
            ) {
                setValue(newState);
            }
        };

        if (debounce) {
            handleStateChange = _.debounce(handleStateChange, wait);
        }

        const unsubscribe = subscribe(handleStateChange);

        return () => {
            unsubscribe();
        };
    });

    return value;
};
