import Reactium from 'reactium-core/sdk';
import React, { useRef, useState, useEffect } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory, createMemoryHistory } from 'history';
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

let history;
export const getHistory = () => {
    const createHistory =
        typeof window !== 'undefined' && window.process && window.process.type
            ? createMemoryHistory
            : createBrowserHistory;

    if (!history) {
        history = createHistory();
    }

    return history;
};

export default () => {
    const routes = useRouting();

    return (
        <Router history={getHistory()}>
            <Switch>
                {routes.map(({ id, ...route }) => (
                    <Route {...route} key={id} />
                ))}
            </Switch>
        </Router>
    );
};
