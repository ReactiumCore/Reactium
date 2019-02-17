import actionTypes from './actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case actionTypes.INIT_ROUTES: {
            return {
                ...state,
                routes: action.routes,
                updated: action.updated,
            };
        }
    }

    return state;
};
