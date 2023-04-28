import _ from 'underscore';
import op from 'object-path';
import { ComponentEvent } from '@atomic-reactor/reactium-sdk-core';
import cc from 'camelcase';
import { useEffect } from 'react';

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

export const useStateEffectFactory = Reactium => (handlers = {}, deps) => {
    const unsubs = [];
    const target = Reactium.State;

    // sanitize handlers
    Object.entries(handlers).forEach(([type, cb]) => {
        if (
            typeof cb === 'function' &&
            !Object.values(op.get(target, ['listeners', type], {})).find(
                f => f === cb,
            )
        ) {
            unsubs.push(target.addEventListener(type, cb));
        }
    });

    useEffect(() => {
        return () => {
            unsubs.forEach(unsub => unsub());
        };
    }, deps);
};
