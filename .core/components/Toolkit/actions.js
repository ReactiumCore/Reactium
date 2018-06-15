import deps from 'dependencies';

const isToolkit = (path) => {
    let exp = /^\/toolkit/i;
    return exp.test(path);
};

export default {
    mount: (data) => (dispatch) => {

        return dispatch({
            type: deps.actionTypes.TOOLKIT_MOUNT,
            data,
        });
    },

    menuItemClick: (url) => (dispatch) => {
        if (isToolkit(url)) {

            let uarr = url.split('/toolkit')[1].split('/');
                uarr.shift();

            let group = uarr[0];
            let element = uarr[1];
            let params = {group, element};

            return dispatch({
                type: deps.actionTypes.TOOLKIT_NAV,
                params,
            });
        }
    },

    set: ({key, value}) => (dispatch) => {
        return dispatch({
            type: deps.actionTypes.TOOLKIT_PREF,
            value,
            key,
        });
    },

    setTheme: (theme) => (dispatch) => {
        return dispatch({
            type: deps.actionTypes.TOOLKIT_THEME,
            theme,
        });
    },
};
