import deps from 'dependencies';
import op from 'object-path';

export default {
    updateRoute: ({ history, location, match, route = {}, params, search }) => (
        dispatch,
        getState,
    ) => {
        const state = getState();
        const Router = op.get(state, 'Router', {});
        const prevLocation = op.get(Router, 'location', {});

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

        dispatch({
            type: deps().actionTypes.UPDATE_ROUTE,
            history,
            location,
            prevLocation,
            match,
            params,
            search,
        });
    },
};
