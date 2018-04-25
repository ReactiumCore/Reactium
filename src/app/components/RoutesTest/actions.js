import { actionTypes } from 'appdir/app';
import { services } from 'appdir/app';

export default {
    mount: (data, search) => (dispatch) => {
        dispatch({type: actionTypes.ROUTESTEST_MOUNT, data, search});
    },
};
