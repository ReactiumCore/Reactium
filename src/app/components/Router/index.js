import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RouteObserver from './RouteObserver';
import { routes } from 'appdir/app';
import NotFound from 'appdir/components/NotFound';

export default class AppRouter extends Component {
    render() {
        return (
            <Router>
                <div>
                    <RouteObserver />
                    <Switch>
                        {
                            routes.map(route => {
                                if (typeof route.path === 'string') {
                                    return <Route {...route} />;
                                }

                                if (Array.isArray(route.path)) {
                                    return route.path.map((path, key) => {
                                        const params = {...route, path, key: `${route.key}+${key}`};
                                        return <Route {...params} />
                                    })
                                }
                            })
                        }
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </Router>
        );
    }
}
