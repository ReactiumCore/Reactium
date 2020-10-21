import uuid from 'uuid/v4';
import { useState, useRef, useEffect } from 'react';
import Routing from '../routing';
import op from 'object-path';

export const useRouting = () => {
    const [, update] = useState(new Date());
    const routing = useRef({
        current: Routing.currentRoute,
        previous: Routing.previousRoute,
        active: Routing.currentRoute,
        transitionState: 'READY',
        transitionStates: [],
        changes: {},
    });

    const handler = updates => {
        routing.current = {
            ...routing.current,
            ...updates,
        };
        update(new Date());
    };

    useEffect(() => {
        const id = uuid();
        Routing.routeListeners.register(id, { handler });
        return () => {
            Routing.routeListeners.unregister(id);
        };
    }, []);

    return routing.current;
};
