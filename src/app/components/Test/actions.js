import deps from 'dependencies';

export default {
    mount: params => (dispatch) => {
        return deps.services.Test.fetchHello().then((data) => {
            dispatch({type: deps.actionTypes.TEST_MOUNT, data: data});
        })
        .catch(error => console.error(error));
    },

    click: () => (dispatch) => {
        dispatch({type: deps.actionTypes.TEST_CLICK});
    },
};
