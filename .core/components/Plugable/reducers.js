import deps from 'dependencies';
import { combineReducers } from 'redux';

const byId = (state = {}, action) => {
    switch (action.type) {
        case deps.actionTypes.ADD_PLUGIN: {
            const { type, ...plugin } = action;
            return {
                ...state,
                [action.id]: plugin,
            };
        }
        case deps.actionTypes.UPDATE_PLUGIN: {
            const { type, ...plugin } = action;
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    ...plugin,
                },
            };
        }

        case deps.actionTypes.DELETE_PLUGIN: {
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
        case deps.actionTypes.ADD_PLUGIN: {
            if (state.find(id => id === action.id)) return state;
            return [...state, action.id];
        }
        case deps.actionTypes.REMOVE_PLUGIN: {
            return state.filter(pluginId => pluginId !== action.id);
        }
        default: {
            return state;
        }
    }
};

export default combineReducers({ byId, allIds });
