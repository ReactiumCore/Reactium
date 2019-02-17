import actionTypes from './actionTypes';
import moment from 'moment';

export default {
    init: routes => ({
        type: actionTypes.INIT_ROUTES,
        routes,
        updated: moment().toString(),
    }),

    add: route => ({
        type: actiontypes.ADD_ROUTE,
        updated: moment().toString(),
        route,
    }),

    remove: path => ({
        type: actionTypes.REMOVE_ROUTE,
        updated: moment().toString(),
        path,
    }),
};
