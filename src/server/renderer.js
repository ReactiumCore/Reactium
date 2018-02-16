import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import serialize from 'serialize-javascript';
import storeCreator from 'appdir/storeCreator';
import { matchRoutes } from 'react-router-config';
import { routes } from 'appdir/app';
import Router from 'appdir/components/Router';

const template = (content, helmet, store) =>
`<html ${helmet.htmlAttributes.toString()}>
    <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        <link rel="stylesheet" href="/assets/style/style.css" />
    </head>
    <body ${helmet.bodyAttributes.toString()}>
        <Component type="DevTools"></Component>
        <div id="router">${content}</div>

        <script>
            window.INITIAL_STATE = ${serialize(store.getState())}
            window.restAPI = '/api';
            window.parseAppId = '${parseAppId}'
        </script>
        <script src="/assets/js/main.js"></script>
    </body>
</html>`;

export default (req, res, context) => {
    const store = storeCreator({ server: true });

    const loaders = matchRoutes(routes, req.path)
        .map(({route, match}) => ({
            ...route,
            params: match.params,
        }))
        .filter(route => route.load)
        .map(route => route.load(route.params))
        .map(thunk => thunk(store.dispatch, store.getState, store));


    // Wait for all loaders or go ahead and render on error
    return new Promise(resolve => {
        Promise.all(loaders)
            .then(() => resolve(true))
            .catch(err => {
                console.error(err);
                resolve(true)
            });
    })
    .then(() => {
        const content = renderToString(
            <Provider store={store}>
                <Router server={true} location={req.path} context={context} />
            </Provider>
        );

        const helmet = Helmet.renderStatic();

        return template(content, helmet, store);
    })
    .catch(err => console.error(err));
};
