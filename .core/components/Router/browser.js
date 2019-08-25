import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory, createMemoryHistory } from 'history';
import getRoutes from './getRoutes';
import op from 'object-path';

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

export default class AppRouter extends Component {
    shouldComponentUpdate({ updated }) {
        return !!(this.props.updated && updated !== this.props.updated);
    }

    render() {
        const routes = op.get(this.props, 'routes', getRoutes());
        return (
            <Router history={getHistory()}>
                <Switch>
                    {routes.map(route => (
                        <Route
                            {...route}
                            key={route.path ? route.path : 'not-found'}
                        />
                    ))}
                </Switch>
            </Router>
        );
    }
}
