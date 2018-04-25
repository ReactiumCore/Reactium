import { actionTypes } from 'appdir/app';

export default (state = {}, action) => {

    let newState;

    switch (action.type) {

        case actionTypes.ROUTESTEST_MOUNT:
            return {
                ...state,
                ...action.data,
                search: action.search
            };
        default:
            return state;
    }
};
