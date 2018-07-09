import deps from "dependencies";

export default (state = {}, action) => {
    let newState;

    switch (action.type) {
        case deps.actionTypes.TEST_MOUNT:
            newState = Object.assign(
                {},
                state,
                { ...action.data },
                { loaded: true }
            );
            return newState;
            break;

        case deps.actionTypes.TEST_CLICK:
            let count = state.count || 0;
            newState = Object.assign({}, state, { count: count + 1 });
            return newState;
            break;

        default:
            return state;
    }
};
