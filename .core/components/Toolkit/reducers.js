import deps from 'dependencies';
import manifest from 'appdir/toolkit/manifest';
import op from 'object-path';


export default (state = {}, action) => {

    let newState;

    switch (action.type) {

        case deps.actionTypes.TOOLKIT_MOUNT:
            newState = { ...state, ...action.data, manifest };
            return newState;

        case deps.actionTypes.TOOLKIT_NAV:
            let { group = null, element = null } = action.params;
            newState = { ...state, group, element };
            return newState;

        case deps.actionTypes.TOOLKIT_PREF:
            newState = { ...state };
            let karry = action.key.split('.');

            let all = karry.pop();
            if (all === 'all') { op.empty(newState, karry.join('.'), null); }

            op.set(newState, action.key, action.value);

            return newState;

        case deps.actionTypes.TOOLKIT_THEME:

            newState = { ...state, style: action.theme };

            return newState;

        default:
            return state;
    }
};
