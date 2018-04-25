import { actionTypes } from 'appdir/app';
import { combineReducers } from 'redux';

const Router = (state = {}, action) => {
    switch ( action.type ) {
        case actionTypes.UPDATE_ROUTE: {
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
