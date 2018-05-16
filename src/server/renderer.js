import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import serialize from 'serialize-javascript';
import storeCreator from 'appdir/storeCreator';
import { matchRoutes } from 'react-router-config';
import Router from 'components/Router';
import querystring from 'querystring';

function normalizeAssets(assets) {
    return Array.isArray(assets) ? assets : [assets]
}

const template = (content, helmet, store, res) => {
    let scripts =
        '<script src="/assets/js/vendors.js"></script>' +
        '<script src="/assets/js/main.js"></script>';

    if ( process.env.NODE_ENV === 'development' ) {
        const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;
        const { vendors, main } = assetsByChunkName;
        scripts = [ vendors, main ]
            .map(chunk => normalizeAssets(chunk).filter(path => path.endsWith('.js')))
            .reduce((files, chunk) => files.concat(chunk), [])
            .map(path => `<script src="${path}"></script>`)
            .join('\n');
    }

    return `<html ${helmet.htmlAttributes.toString()}>
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
            ${scripts}
        </body>
    </html>`;
};

export default (req, res, context) => {
    const store = storeCreator({ server: true });
    const matches = matchRoutes(dependencies.routes, req.path);
    const loaders = matches
        .map(({route, match}) => {
            return {
                ...route,
                params: match.params,
                query: req.query ? req.query : {},
            };
        })
        .filter(route => route.load)
        .map(route => route.load(route.params, route.query))
        .map(thunk => thunk(store.dispatch, store.getState, store));

    // Check for 404
    context.notFound = ! matches.length || !( 'path' in matches[0].route );

    // Wait for all loaders or go ahead and render on error
    return new Promise(resolve => {
        console.log('Loading page data...');

        Promise.all(loaders)
            .then(() => {
                console.log('Page data loading complete.')
                resolve();
            })
            .catch(error => {
                console.error('Page data loading error.', error);
                resolve();
            })
    }).then(() => {
        let html = '';
        const body = renderToString(
            <Provider store={store}>
                <Router server={true} location={req.path} context={context} />
            </Provider>
        );

        const helmet = Helmet.renderStatic();
        html = template(body, helmet, store, res);

        return html;
    });
};
