import { actionTypes } from 'appdir/app';

export default (state = {}, action) => {

    let newState;

    switch (action.type) {

        case actionTypes.TEST_MOUNT:

            newState = Object.assign({}, state, {...action.data});
            return newState;
            break;

        case actionTypes.TEST_CLICK:

            let count = state.count || 0;
            newState = Object.assign({}, state, {count: count + 1});
            return newState;
            break;

        default:
            return state;
    }
};