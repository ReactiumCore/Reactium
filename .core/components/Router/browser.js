import React, { Component, Fragment } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import RouteObserver from './RouteObserver';
import op from 'object-path';

export default class AppRouter extends Component {
    shouldComponentUpdate({ updated }) {
        return !!(this.props.updated && updated !== this.props.updated);
    }

    render() {
        const { routes = [] } = this.props;

        return (
            <BrowserRouter>
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
            </BrowserRouter>
        );
    }
}
