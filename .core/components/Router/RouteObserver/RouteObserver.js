import React, { Component } from 'react';
import { matchPath } from 'react-router'
import deps from 'dependencies';

export default class RouteObserver extends Component {
    /**
     * When route updates, find matching route and dispatch update.
     * @see actions to see how to load data on route changes
     * e.g. appdir/product-page/route
     */
    processRoute() {
        const { location, Router, updateRoute } = this.props;

        const pathChanged = ! Router.pathname || location.pathname !== Router.pathname;
        const searchChanged = 'search' in Router && location.search !== Router.search;

        if ( pathChanged || searchChanged) {
            let [ route ] = deps.routes.filter(route => {
                let match = matchPath(location.pathname, route);
                return match && match.isExact;
            });

            if ( location ) {
                let routeParams = {};

                if (route) {
                    routeParams = matchPath(location.pathname, route).params;
                }

                updateRoute(
                    location,
                    route,
                    routeParams
                );
            }
        }
    }

    componentDidMount() {
        this.processRoute();
    }

    componentDidUpdate() {
        this.processRoute();
    }

    render() {
        return null;
    }
}
