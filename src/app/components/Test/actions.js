import deps from 'dependencies';

export default {
    mount: data => dispatch => {
        return dispatch({
            type: deps.actionTypes.TEST_MOUNT,
            data,
        });
    },
};
