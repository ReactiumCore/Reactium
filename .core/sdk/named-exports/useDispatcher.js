import _ from 'underscore';
import op from 'object-path';
import {
    ComponentEvent,
    useEventEffect,
} from '@atomic-reactor/reactium-sdk-core';
import cc from 'camelcase';

export const useDispatcherFactory = Reactium => ({ props, state }) => (
    type,
    obj,
) => {
    if (!state) state = Reactium.State;

    obj = _.isObject(obj) ? obj : {};

    const evt = new ComponentEvent(type, obj);
    const cb = op.get(props, cc(`on-${type}`));

    if (_.isFunction(cb)) state.addEventListener(type, cb);

    state.dispatchEvent(evt);

    if (_.isFunction(cb)) state.removeEventListener(type, cb);
};

export const useStateEffectFactory = Reactium => (handlers = {}, deps) =>
    useEventEffect(Reactium.State, handlers, deps);
