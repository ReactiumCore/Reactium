import Plugin from '../plugin';
import { combineReducers } from 'redux';
import Enums from '../enums';

const Reducer = {};
const prematureCallError = Enums.Plugin.prematureCallError;

Reducer.register = (ID, reducer) => {
    if (!Plugin.ready) {
        console.error(new Error(prematureCallError('Reducer.register()')));
        return;
    }

    if (ID) {
        Plugin.redux.allReducers[ID] = reducer;
        Plugin.redux.store.replaceReducer(
            combineReducers({ ...Plugin.redux.allReducers }),
        );
    }
};

Reducer.unregister = ID => {
    if (!Plugin.ready) {
        console.error(new Error(prematureCallError('Reducer.unregister()')));
        return;
    }

    if (ID in Plugin.redux.allReducers) {
        delete Plugin.redux.allReducers[ID];
        Plugin.redux.store.replaceReducer(
            combineReducers({ ...Plugin.redux.allReducers }),
        );
    }
};

export default Reducer;
