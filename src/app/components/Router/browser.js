import React, { Component, Fragment } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import RouteObserver from './RouteObserver';
import deps from 'dependencies';

export default class AppRouter extends Component {
    render() {
        return (
            <BrowserRouter>
                <Fragment>
                    <RouteObserver />
                    <Switch>
                        {renderRoutes(deps.routes)}
                    </Switch>
                </Fragment>
            </BrowserRouter>
        );
    }
}
