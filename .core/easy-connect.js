import { useContext, useState, useEffect, useRef } from 'react';
import { connect, ReactReduxContext } from 'react-redux';
import op from 'object-path';
import * as equals from 'shallow-equals';

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
 * Default to shallow equals.
 */
const defaultShouldUpdate = ({ prevState, nextState }) =>
    !equals(prevState, nextState);

/**
 * useSelect hook - subscribe to subtree of redux and control updates.
 * @description select subtree from redux state, and govern when to inform component of changes.
 * @param select [Function] select function is passed the full redux state, returns your
 * custom derived object / substate.
 * @param shouldUpdate [Function] passed object with newState and prevState.
 *
 * Returns true if state should be updated in hook.
 */
export const useSelect = ({
    select = newState => newState,
    shouldUpdate = defaultShouldUpdate,
}) => {
    const { getState, subscribe } = useStore();
    const stateRef = useRef(select(getState()));
    const [value, setValue] = useState(stateRef.current);

    const setState = () => {
        const newState = select(getState());
        const prevState = stateRef.current;

        if (
            shouldUpdate({
                newState,
                prevState,
            })
        ) {
            stateRef.current = newState;
            setValue(stateRef.current);
        }
    };

    useEffect(() => {
        const unsubscribe = subscribe(setState);
        return () => {
            unsubscribe();
        };
    });

    return value;
};
