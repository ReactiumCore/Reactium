import deps from 'dependencies';

export default {
    mount: (data) => (dispatch) => {
        return dispatch({
            type: deps.actionTypes.HEADER_MOUNT,
            data,
        });
    },
};
