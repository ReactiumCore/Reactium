import deps from 'dependencies';

export default {
    mount: params => (dispatch, getState) => {
        let state = getState()['Test'];
        let { loaded = false } = state;

        if (loaded !== true) {
            return deps.services.Test.fetchHello().then((data) => {
                dispatch({type: deps.actionTypes.TEST_MOUNT, data});
            }).catch(error => console.error(error));
        } else {
            return dispatch({type: deps.actionTypes.TEST_MOUNT, data: state});
        }
    },

    click: () => (dispatch) => {
        dispatch({type: deps.actionTypes.TEST_CLICK});
    },
};
