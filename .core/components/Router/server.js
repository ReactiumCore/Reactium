import React, { Component, Fragment } from 'react';
import { StaticRouter, Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

export default class AppRouter extends Component {
    shouldComponentUpdate({ updated }) {
        return !!(this.props.updated && updated !== this.props.updated);
    }

    render() {
        const { routes = [], ...props } = this.props;
        return (
            <StaticRouter {...props} context={this.props.context}>
                <Fragment>
                    <Switch>{renderRoutes(routes)}</Switch>
                </Fragment>
            </StaticRouter>
        );
    }
}
