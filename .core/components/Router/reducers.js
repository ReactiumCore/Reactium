import deps from 'dependencies';
import { combineReducers } from 'redux';

const Router = (state = {}, action) => {
    switch (action.type) {
        case deps().actionTypes.UPDATE_ROUTE: {
            const { location, history, match, params, search } = action;

            return {
                ...location,
                history,
                match,
                params,
                urlParams: search,
            };
        }
        default: {
            return state;
        }
    }
};

export default Router;
