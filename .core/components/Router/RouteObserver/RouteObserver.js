import React, { Component } from 'react';
import { matchPath } from 'react-router';

export default class RouteObserver extends Component {
    /**
     * When route updates, find matching route and dispatch update.
     * @see actions to see how to load data on route changes
     * e.g. appdir/product-page/route
     */
    processRoute() {
        const {
            history,
            location,
            match,
            Router,
            updateRoute,
            routes = [],
        } = this.props;

        const pathChanged =
            !Router.pathname || location.pathname !== Router.pathname;
        const searchChanged =
            'search' in Router && location.search !== Router.search;

        if (pathChanged || searchChanged) {
            let [route] = routes.filter(route => {
                if (!route.path) return false;
                let match = matchPath(location.pathname, route);
                return match && match.isExact;
            });

            if (location) {
                let routeParams = {};

                if (route) {
                    routeParams = matchPath(location.pathname, route).params;
                }

                updateRoute({
                    history,
                    location,
                    match,
                    route,
                    params: routeParams,
                });
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
