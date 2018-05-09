import { actionTypes } from 'appdir/app';
import queryString from 'querystring-browser';

export default {
    updateRoute: (location, route = {}, params) => (dispatch, getState) => {
        const { Router } = getState();

        if ( typeof window !== 'undefined' && Router.pathname !== location.pathname ) {
            window.scrollTo(0,0);
        }

        dispatch({
            type: actionTypes.UPDATE_ROUTE,
            location,
            params,
        });

        // load route data
        if ( 'load' in route ) {
            dispatch(route.load(params, queryString.parse(location.search)));
        }
    },
};
