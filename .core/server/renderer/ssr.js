import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import querystring from 'querystring';
import { matchRoutes } from 'react-router-config';
import storeCreator from 'reactium-core/storeCreator';
import Router from 'reactium-core/components/Router';

const app = {};
app.dependencies = global.dependencies = require('dependencies').default;

const renderer = template => (req, res, context) => {
    app.dependencies.init();
    const store = storeCreator({ server: true });
    const matches = matchRoutes(dependencies.routes, req.path);
    const loaders = matches
        .map(({ route, match }) => {
            return {
                ...route,
                params: match.params,
                query: req.query ? req.query : {}
            };
        })
        .filter(route => route.load)
        .map(route => route.load(route.params, route.query))
        .map(thunk => thunk(store.dispatch, store.getState, store));

    // Check for 404
    context.notFound = !matches.length || !('path' in matches[0].route);

    // Wait for all loaders or go ahead and render on error
    return new Promise(resolve => {
        console.log('[Reactium] Loading page data...');

        Promise.all(loaders)
            .then(() => {
                console.log('[Reactium] Page data loading complete.');
                resolve();
            })
            .catch(error => {
                console.error('[Reactium] Page data loading error.', error);
                resolve();
            });
    }).then(() => {
        let html = '';
        const body = renderToString(
            <Provider store={store}>
                <Router server={true} location={req.path} context={context} />
            </Provider>
        );

        const helmet = Helmet.renderStatic();
        html = template(body, helmet, store, req, res);

        return html;
    });
};

module.exports = template => renderer(template);
