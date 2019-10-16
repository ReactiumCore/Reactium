import deps from 'dependencies';
import { combineReducers } from 'redux';

const byId = (state = {}, action) => {
    switch (action.type) {
        case deps().actionTypes.ADD_PLUGIN: {
            const { type, ...plugin } = action;
            return {
                ...state,
                [action.id]: plugin,
            };
        }
        case deps().actionTypes.UPDATE_PLUGIN: {
            const { type, ...plugin } = action;
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    ...plugin,
                },
            };
        }

        case deps().actionTypes.REMOVE_PLUGIN: {
            const newState = {
                ...state,
            };
            delete newState[action.id];
            return newState;
        }

        default: {
            return state;
        }
    }
};

const allIds = (state = [], action) => {
    switch (action.type) {
        case deps().actionTypes.ADD_PLUGIN: {
            if (state.find(id => id === action.id)) return state;
            return [...state, action.id];
        }
        case deps().actionTypes.REMOVE_PLUGIN: {
            return state.filter(pluginId => pluginId !== action.id);
        }
        default: {
            return state;
        }
    }
};

const controls = (state = {}, action) => {
    switch (action.type) {
        case deps().actionTypes.ADD_PLUGIN_CONTROLS: {
            return {
                ...state,
                [action.name]: action.controls,
            };
        }
        case deps().actionTypes.REMOVE_PLUGIN_CONTROLS: {
            const newState = { ...state };
            delete newState[action.name];
            return newState;
        }
        default: {
            return state;
        }
    }
};

export default (...reducerArgs) =>
    combineReducers({ byId, allIds, controls })(...reducerArgs);
