import { useContext, useState } from 'react';
import { connect, ReactReduxContext } from 'react-redux';
import op from 'object-path';

/**
 * An "easy connect" helper for redux.
 * Provides getState and dispatch from store using connect HoC
 */
export const ec = Component => {
    return connect(state => ({
        getState: () => state,
    }))(Component);
};

/**
 * Custom React hooks for accessing store or specific data from the store.
 */
export const useStore = () =>
    op.get(useContext(ReactReduxContext), 'store', { getState: () => ({}) });

/**
 * Module Constructor
 * @description Internal constructor of the module that is being exported.
 * @param select [Function] select function passed the full redux state, returns the
 * @param shouldUpdate [Function] passed object with newState and prevState.
 * Returns true if state should be updated in hook.
 */
export const useSelect = ({
    select = newState => newState,
    shouldUpdate = ({ prevState, nextState }) => true,
}) => {
    const { getState, subscribe } = useStore();
    const [state, updatedState] = useState(select(getState()));

    subscribe(() => {
        const newState = getState();
        if (
            shouldUpdate({
                newState,
                prevState: state,
            })
        ) {
            updatedState(select(newState));
        }
    });
    return state;
};
