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
        case actionTypes.ADD_ROUTE: {
            return {
                ...state,
                routes: [...state.routes, action.route].sort(
                    (a, b) => a.order - b.order,
                ),
                updated: action.updated,
            };
        }
        case actionTypes.REMOVE_ROUTE: {
            return {
                ...state,
                routes: routes.filter(route => route.path !== action.path),
                updated: action.updated,
            };
        }
    }

    return state;
};
