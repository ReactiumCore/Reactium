import Handle from '../handle';
import op from 'object-path';
import { useRef, useState, useEffect } from 'react';

export const useRegisterHandle = (ID, cb, deps = []) => {
    const ref = useRef(cb());
    Handle.register(ID, ref);

    useEffect(() => {
        ref.current = cb();
        Handle.register(ID, ref);
        return () => Handle.unregister(ID);
    }, deps);
};

export const useHandle = ID => {
    const ref = useRef(op.get(Handle.get(ID), 'current'));
    const [, update] = useState(ref.current);
    const setHandle = newRef => {
        const handle = op.get(newRef, 'current');

        if (op.has(newRef, 'current') && handle !== ref.current) {
            ref.current = handle;
            update(ref.current);
        }
    };

    useEffect(() => {
        return Handle.subscribe(() => {
            setHandle(Handle.get(ID));
        });
    }, []);

    return ref.current;
};
