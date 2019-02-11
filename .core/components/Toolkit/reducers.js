import deps from 'dependencies';
import manifest from 'appdir/toolkit';
import op from 'object-path';

export default (state = {}, action) => {
    let newState;

    switch (action.type) {
        case deps.actionTypes.TOOLKIT_LOAD:
            return { ...state, ...action.data, manifest, loading: true };

        case deps.actionTypes.TOOLKIT_LOADED:
            return { ...state, loading: null };

        case deps.actionTypes.TOOLKIT_MOUNT:
            return { ...state, ...action.data, manifest };

        case deps.actionTypes.TOOLKIT_NAV:
        case deps.actionTypes.UPDATE_ROUTE:
            const { group = null, element = null } = action.params;
            return { ...state, group, element };

        case deps.actionTypes.TOOLKIT_PREF:
            newState = { ...state, update: Date.now() };
            const karry = action.key.split('.');
            const all = karry.pop();

            if (all === 'all') {
                op.empty(newState, karry.join('.'), null);
            }

            op.set(newState, action.key, action.value);

            return newState;

        case deps.actionTypes.TOOLKIT_THEME:
            return { ...state, style: action.theme, update: Date.now() };

        case deps.actionTypes.TOOLKIT_MENU_TOGGLE:
            const { animating = false } = state;
            return { ...state, animating: !animating, update: Date.now() };

        case deps.actionTypes.TOOLKIT_NOTICE_UPDATE:
            delete action.params.elm;
            return { ...state, notify: action.params };

        case deps.actionTypes.TOOLKIT_NOTICE_TOGGLE:
            newState = { ...state };

            if (action.visible === false) {
                op.set(newState, 'notify', {});
            }

            op.set(newState, 'notify.animating', false);
            op.set(newState, 'notify.visible', action.visible);

            return newState;

        case deps.actionTypes.TOOLKIT_SETTINGS_TOGGLE:
            return { ...state, showSettings: !state.showSettings };

        default:
            return state;
    }
};
