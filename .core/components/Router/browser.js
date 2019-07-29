import React, { Component, Fragment } from 'react';
import { BrowserRouter, MemoryRouter, Switch, Route } from 'react-router-dom';
import RouteObserver from './RouteObserver';
import op from 'object-path';

const Router =
    typeof window !== 'undefined' && window.process && window.process.type
        ? MemoryRouter
        : BrowserRouter;

export default class AppRouter extends Component {
    shouldComponentUpdate({ updated }) {
        return !!(this.props.updated && updated !== this.props.updated);
    }

    render() {
        const { routes = [] } = this.props;

        return (
            <Router>
                <Fragment>
                    <RouteObserver routes={routes} />
                    <Switch>
                        {routes.map(route => (
                            <Route
                                {...route}
                                key={route.path ? route.path : 'not-found'}
                            />
                        ))}
                    </Switch>
                </Fragment>
            </Router>
        );
    }
}
