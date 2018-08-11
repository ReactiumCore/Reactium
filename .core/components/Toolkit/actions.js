import deps from 'dependencies';
import op from 'object-path';
import Tweenmax, { Power2 } from 'gsap';

const isToolkit = path => {
    let exp = /^\/toolkit/i;
    return exp.test(path);
};

export default {
    mount: data => dispatch => {
        return dispatch({
            type: deps.actionTypes.TOOLKIT_MOUNT,
            data
        });
    },

    menuItemClick: url => dispatch => {
        if (isToolkit(url)) {
            let uarr = url.split('/toolkit')[1].split('/');
            uarr.shift();

            let group = uarr[0];
            let element = uarr[1];
            let params = { group, element };

            return dispatch({
                type: deps.actionTypes.TOOLKIT_NAV,
                params
            });
        }
    },

    menuToggle: elm => (dispatch, getState) => {
        let state = getState()['Toolkit'];

        let { animating = false } = state;

        if (animating === true) {
            return;
        }

        // Let the app know you're animating
        dispatch({ type: deps.actionTypes.TOOLKIT_MENU_TOGGLE });

        // Unset display: none
        Tweenmax.set(elm, { display: 'flex' });

        let expanded = op.get(state, 'prefs.sidebar.expanded', false);

        let w = expanded === true ? 0 : 320;

        let anime = {
            ease: Power2.easeInOut,
            width: `${w}px`,
            onComplete: () => {
                expanded = !expanded;

                let display = expanded === true ? 'flex' : 'none';

                Tweenmax.set(elm, { display });

                dispatch({ type: deps.actionTypes.TOOLKIT_MENU_TOGGLE });
                dispatch({
                    type: deps.actionTypes.TOOLKIT_PREF,
                    value: expanded,
                    key: 'prefs.sidebar.expanded'
                });
            }
        };

        Tweenmax.to(elm, 0.125, anime);
    },

    set: ({ key, value }) => dispatch => {
        return dispatch({
            type: deps.actionTypes.TOOLKIT_PREF,
            value,
            key
        });
    },

    setTheme: theme => dispatch => {
        return dispatch({
            type: deps.actionTypes.TOOLKIT_THEME,
            theme
        });
    }
};
