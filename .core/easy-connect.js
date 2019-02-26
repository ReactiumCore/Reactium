/**
 * An "easy connect" helper for redux.
 * Provides getState and dispatch from store using connect HoC
 */
export const ec = Component => {
    const { connect } = require('react-redux');
    return connect(state => ({
        getState: () => state,
    }))(Component);
};
