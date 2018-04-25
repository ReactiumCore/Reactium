import React, { Component, Fragment } from 'react';
import { StaticRouter, Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { routes } from 'appdir/app';

export default class AppRouter extends Component {
    render() {
        return (
            <StaticRouter {...this.props} context={this.props.context}>
                <Fragment>
                    <Switch>
                        {renderRoutes(routes)}
                    </Switch>
                </Fragment>
            </StaticRouter>
        );
    }
}
