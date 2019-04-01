import deps from 'dependencies';
import queryString from 'querystring-browser';

export default {
    updateRoute: ({ history, location, match, route = {}, params }) => (
        dispatch,
        getState,
    ) => {
        const { Router } = getState();

        const defaultOnRouteChange = () => {
            if (
                typeof window !== 'undefined' &&
                Router.pathname !== location.pathname
            ) {
                window.scrollTo(0, 0);
            }
        };

        // call defaultOnRouteChange, or route's onRouteChage (with defaultOnRouteChange as arg)
        const { onRouteChange = defaultOnRouteChange } = route;
        if (
            typeof onRouteChange === 'function' &&
            typeof window !== 'undefined' &&
            Router.pathname !== location.pathname
        ) {
            onRouteChange(defaultOnRouteChange);
        }

        // load route data
        let search = queryString.parse(location.search.replace(/^\?/, ''));
        if ('load' in route) {
            dispatch(route.load(params, search));
        }

        dispatch({
            type: deps().actionTypes.UPDATE_ROUTE,
            history,
            location,
            match,
            params,
            search,
        });
    },
};
