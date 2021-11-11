import React, { Component, Fragment } from 'react';
import { StaticRouter, Switch, Route } from 'react-router-dom';

const ServerRouter = props => {
    const { routes = [], location } = props;
    return (
        <StaticRouter context={props.context} location={location}>
            <Switch>
                {routes.map(({ id, ...route }) => {
                    return <Route {...route} key='route' />;
                })}
            </Switch>
        </StaticRouter>
    );
};

export default ServerRouter;
