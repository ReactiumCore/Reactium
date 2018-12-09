import deps from 'dependencies';
import op from 'object-path';
import { TweenMax, Power2 } from 'gsap/umd/TweenMax';

const isToolkit = path => {
    let exp = /^\/toolkit/i;
    return exp.test(path);
};

export default {
    mount: data => dispatch => {
        return dispatch({
            type: deps.actionTypes.TOOLKIT_MOUNT,
            data,
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
                params,
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
        TweenMax.set(elm, { display: 'flex' });

        let expanded = op.get(state, 'prefs.sidebar.expanded', false);

        let w = expanded === true ? 0 : 320;

        let anime = {
            ease: Power2.easeInOut,
            width: `${w}px`,
            onComplete: () => {
                expanded = !expanded;

                let display = expanded === true ? 'flex' : 'none';

                TweenMax.set(elm, { display });

                dispatch({ type: deps.actionTypes.TOOLKIT_MENU_TOGGLE });
                dispatch({
                    type: deps.actionTypes.TOOLKIT_PREF,
                    value: expanded,
                    key: 'prefs.sidebar.expanded',
                });
            },
        };

        TweenMax.to(elm, 0.125, anime);
    },

    notice: {
        hide: params => (dispatch, getState) => {
            let state = getState()['Toolkit'];
            let { animating = false } = op.get(state, 'notify', {});
            let { elm } = params;

            elm = elm.cont;

            if (animating === true) {
                return;
            }

            dispatch({
                type: deps.actionTypes.TOOLKIT_NOTICE_UPDATE,
                params: { ...state.notify, animating: true },
            });

            let h = -(elm.offsetHeight + 20);

            TweenMax.to(elm, 0.25, {
                top: `${h}px`,
                ease: Power2.easeInOut,
                onComplete: () => {
                    dispatch({
                        type: deps.actionTypes.TOOLKIT_NOTICE_TOGGLE,
                        visible: false,
                    });

                    elm.style.display = 'none';
                },
            });
        },

        show: params => (dispatch, getState) => {
            let state = getState()['Toolkit'];
            let { animating = false } = op.get(state, 'notify', {});
            let { autohide, dismissable, elm, message } = params;

            elm = elm.cont;

            if (animating === true) {
                return;
            }

            elm.style.display = 'flex';

            params['animating'] = true;

            dispatch({
                type: deps.actionTypes.TOOLKIT_NOTICE_UPDATE,
                params,
            });

            TweenMax.to(elm, 0.25, {
                top: '60px',
                ease: Power2.easeInOut,
                onComplete: () => {
                    dispatch({
                        type: deps.actionTypes.TOOLKIT_NOTICE_TOGGLE,
                        visible: true,
                    });
                },
            });
        },
    },

    set: ({ key, value }) => dispatch => {
        return dispatch({
            type: deps.actionTypes.TOOLKIT_PREF,
            value,
            key,
        });
    },

    setTheme: theme => dispatch => {
        return dispatch({
            type: deps.actionTypes.TOOLKIT_THEME,
            theme,
        });
    },

    toggleSettings: () => dispatch => {
        dispatch({ type: deps.actionTypes.TOOLKIT_SETTINGS_TOGGLE });
    },
};
