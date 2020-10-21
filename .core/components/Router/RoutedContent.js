import React, { useRef, useState, useEffect, Fragment } from 'react';
import Reactium, { useRouting } from 'reactium-core/sdk';
import op from 'object-path';
import { Route, useRouteMatch } from 'react-router';

const useRoutes = () => {
    const routesRef = useRef(Reactium.Routing.get());
    const [value, setValue] = useState(routesRef.current);

    const setState = () => {
        routesRef.current = Reactium.Routing.get();
        setValue(routesRef.current);
    };

    useEffect(() => {
        setState();
        return Reactium.Routing.subscribe(setState);
    }, [Reactium.Routing.updated]);

    return routesRef.current;
};

const RoutedContent = () => {
    // cause rerender if routes are added/removed at runtime
    useRoutes();
    const routing = useRouting();
    const { active } = routing;
    const route = op.get(active, 'match.route');
    const Component = op.get(route, 'component');

    // if we have a route with no component, let react-router handle it however it will
    return Component ? <Component {...routing} /> : <Route {...route} />;
};

export default RoutedContent;
