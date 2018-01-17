import { actionTypes } from 'appdir/app';
import { combineReducers } from 'redux';

const Router = (state = {}, action) => {
    switch ( action.type ) {
        case actionTypes.UPDATE_ROUTE: {
            return {...action.location};
        }
        default: {
            return state;
        }
    }
};

export default Router;
