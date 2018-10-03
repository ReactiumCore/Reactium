import React, { Component, Fragment } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import RouteObserver from './RouteObserver';
import deps from 'dependencies';

export default class AppRouter extends Component {
    render() {
        return (
            <BrowserRouter>
                <Fragment>
                    <RouteObserver />
                    <Switch>
                        {deps.routes.map(route => (
                            <Route {...route} key="route" />
                        ))}
                    </Switch>
                </Fragment>
            </BrowserRouter>
        );
    }
}
