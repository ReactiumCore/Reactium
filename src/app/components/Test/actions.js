import { actionTypes } from 'appdir/app';
import { services } from 'appdir/app';

export default {
    mount: params => (dispatch) => {
        services.Test.fetchHello().then((data) => {
            dispatch({type: actionTypes.TEST_MOUNT, data: data});
        });
    },

    click: () => (dispatch) => {
        dispatch({type: actionTypes.TEST_CLICK});
    },
};
