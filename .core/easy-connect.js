import { useContext, useState } from 'react';
import { connect, ReactReduxContext } from 'react-redux';
import op from 'object-path';

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
 * Returns true if state should be updated in hook.
 * @return {mixed} The selected or derived state as react hook. Subscribed to updates.
 */
export const useSelect = ({
    select = newState => newState,
    shouldUpdate = ({ prevState, nextState }) => true,
}) => {
    const { getState, subscribe } = useStore();
    const [value, setValue] = useState(select(getState()));

    subscribe(() => {
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
    });

    return value;
};
