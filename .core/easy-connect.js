import { useContext } from 'react';
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

export const useSelect = (...select) =>
    op.get(useStore().getState(), ...select);
