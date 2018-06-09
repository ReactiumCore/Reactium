import deps from 'dependencies';

export default {
    mount: (data) => (dispatch) => {

        return dispatch({
            type: deps.actionTypes.TOOLKIT_MOUNT,
            data,
        });
    },
};
