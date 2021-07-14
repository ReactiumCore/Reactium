import React, { useEffect } from 'react';
import Reactium, { useRouting, useSyncState } from 'reactium-core/sdk';
import { Route } from 'react-router';

const useRoutes = () => {
    const routeState = useSyncState(Reactium.Routing.get());
    const setState = () => {
        routeState.set(Reactium.Routing.get());
    };

    useEffect(() => {
        setState();
        return Reactium.Routing.subscribe(setState);
    }, []);

    return routeState;
};

const RoutedContent = () => {
    // cause rerender if routes are added/removed at runtime
    useRoutes();
    const routing = useRouting();
    const route = routing.get('active.match.route');
    const Component = routing.get('active.match.route.component');

    // if we have a route with no component, let react-router handle it however it will
    return Component ? <Component {...routing.get()} /> : <Route {...route} />;
};

export default RoutedContent;
