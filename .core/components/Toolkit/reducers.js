import deps from 'dependencies';
import manifest from 'appdir/toolkit/manifest';


export default (state = {}, action) => {

    let newState;

    switch (action.type) {

        case deps.actionTypes.TOOLKIT_MOUNT:
            newState = { ...state, ...action.data, manifest };
            return newState;

        default:
            return state;
    }
};
