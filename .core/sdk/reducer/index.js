import Plugin from '../plugin';
import { combineReducers } from 'redux';
import Enums from '../enums';

const Reducer = {};
const prematureCallError = Enums.Plugin.prematureCallError;

/**
  * @api {Function} Reducer.register() register a new redux reducer
  * @apiName Reducer.register
  * @apiDescription Register a Redux reducer.
  This should be called only:
  1. within `Reactium.Plugin.register()` promise callback,
  2. or after the `plugin-dependencies` hook, (e.g. `plugin-init`)
  3. or after `Reactium.Plugin.ready === true`.
  * @apiParam {String} pluginName the unique name of your plugin
  * @apiParam {String} reducer the reducer function
  * @apiGroup Reducer
  * @apiExample Example Usage
import Reactium from 'reactium-core/sdk';
const reducer = (state, action) => {
    if (action.type === 'SOME_ACTION') {
        return 'some state';
    }
    return state;
};

Reactium.Reducer.register('myPlugin', reducer);
  */
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

/**
  * @api {Function} Reducer.unregister() unregister a new redux reducer
  * @apiName Reducer.unregister
  * @apiDescription Remove a Redux reducer.
  * @apiParam {String} pluginName the unique name of your plugin.
  This should be called only:
  1. within `Reactium.Plugin.register()` promise callback,
  2. or after the `plugin-dependencies` hook, (e.g. `plugin-init`)
  3. or after `Reactium.Plugin.ready === true`.
  * @apiGroup Reducer
  * @apiExample Example Usage
import Reactium from 'reactium-core/sdk';
Reactium.Reducer.unregister('myPlugin');
  */
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
