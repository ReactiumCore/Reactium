import deps from 'dependencies';
import { combineReducers } from 'redux';

const Router = (state = {}, action) => {
    switch ( action.type ) {
        case deps.actionTypes.UPDATE_ROUTE: {
            const { location, params } = action;
            return {
                ...location,
                params,
            };
        }
        default: {
            return state;
        }
    }
};

export default Router;
