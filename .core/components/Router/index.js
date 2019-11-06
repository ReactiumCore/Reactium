import Reactium from 'reactium-core/sdk';
import React, { useRef, useState, useEffect, Fragment } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import op from 'object-path';

export const useRouting = () => {
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

export default ({ history }) => {
    const routes = useRouting();

    return (
        <Router history={history}>
            <Switch>
                {routes.map(({ id, ...route }) => (
                    <Route {...route} key='route' />
                ))}
            </Switch>
        </Router>
    );
};
