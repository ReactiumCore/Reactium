import uuid from 'uuid/v4';
import { useEffect } from 'react';
import Routing from '../routing';
import { useSyncState } from '@atomic-reactor/reactium-sdk-core';

export const useRouting = () => {
    const routing = useSyncState({
        current: Routing.currentRoute,
        previous: Routing.previousRoute,
        active: Routing.currentRoute,
        transitionState: Routing.transitionState || 'READY',
        transitionStates: Routing.transitionStates || [],
        changes: Routing.changes || {},
    });

    const handler = (updates, forceRefresh = true) => {
        routing.set(updates, undefined, forceRefresh);
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

    return routing;
};
