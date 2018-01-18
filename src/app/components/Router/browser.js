import React, { Component, Fragment } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import RouteObserver from './RouteObserver';
import { routes } from 'appdir/app';

export default class AppRouter extends Component {
    render() {
        return (
            <BrowserRouter>
                <Fragment>
                    <RouteObserver />
                    <Switch>
                        {renderRoutes(routes)}
                    </Switch>
                </Fragment>
            </BrowserRouter>
        );
    }
}
