import actionTypes from './actionTypes';
import moment from 'moment';
import getComponents from 'dependencies/getComponents';
import op from 'object-path';

export default {
    init: routes => ({
        type: actionTypes.INIT_ROUTES,
        routes,
        updated: moment().toString(),
    }),

    add: route => {
        const Found = getComponents([{ type: route.component }]);
        const component = op.get(Found, route.component, () => null);

        return {
            type: actionTypes.ADD_ROUTE,
            updated: moment().toString(),
            route: {
                ...route,
                component,
            },
        };
    },

    remove: path => ({
        type: actionTypes.REMOVE_ROUTE,
        updated: moment().toString(),
        path,
    }),
};
