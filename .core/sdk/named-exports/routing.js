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
        transitionState: Routing.transitionState || 'READY',
        transitionStates: Routing.transitionStates || [],
        changes: Routing.changes || {},
    });

    const handler = (updates, forceRefresh = true) => {
        routing.current = {
            ...routing.current,
            ...updates,
        };

        if (forceRefresh === true) update(new Date());
    };

    const refreshFromRouting = () => {
        const {
            active: activeLabel = 'current',
            currentRoute,
            previousRoute,
            transitionState = 'READY',
            transitionStates = [],
            changes,
        } = Routing;

        const active =
            activeLabel === 'previous' ? previousRoute : currentRoute;

        handler(
            {
                current: currentRoute,
                previous: previousRoute,
                active,
                transitionState,
                transitionStates,
                changes,
            },
            false,
        );
    };

    useEffect(() => {
        const id = uuid();
        Routing.routeListeners.register(id, { handler });
        refreshFromRouting();

        return () => {
            Routing.routeListeners.unregister(id);
        };
    }, []);

    return routing.current;
};
