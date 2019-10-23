import React from 'react';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { renderToString } from 'react-dom/server';
import querystring from 'querystring';
import op from 'object-path';
import { matchRoutes } from 'react-router-config';
import Reactium from 'reactium-core/sdk';
import 'reactium-core/redux/storeCreator';
import { PlugableProvider } from 'reactium-core/components/Plugable';
import Router from 'reactium-core/components/Router/server';
import deps from 'dependencies';

const app = {};
app.dependencies = global.dependencies = deps;

const renderer = template => async (req, res, context) => {
    await Reactium.Hook.run('dependencies-load');
    await Reactium.Routing.load();
    const routes = Reactium.Routing.get();
    const { store } = await Reactium.Hook.run('store-create', { server: true });
    const [url] = req.originalUrl.split('?');
    const matches = matchRoutes(routes, url);

    try {
        let [match] = matches;
        if (matches.length > 1) {
            match = matches.find(match => match.isExact);
        }

        const matchedRoute = op.get(match, 'route', {});
        const route = {
            ...matchedRoute,
            params: op.get(match, 'match.params', {}),
            query: req.query ? req.query : {},
        };

        // Check for 404
        context.notFound = !matches.length || !('path' in matchedRoute);

        // Wait for loader or go ahead and render on error
        console.log('[Reactium] Loading page data...');
        const data = await ('load' in route && typeof route.load === 'function'
            ? Promise.resolve(route.load(route.params, route.query)).then(
                  thunk => thunk(store.dispatch, store.getState, store),
              )
            : Promise.resolve());

        await Reactium.Hook.run(
            'data-loaded',
            data,
            route,
            route.params,
            route.query,
        );
        console.log('[Reactium] Page data loading complete.');
    } catch (error) {
        console.error('[Reactium] Page data loading error.', error);
    }

    const body = renderToString(
        <Provider store={store}>
            <PlugableProvider {...app.dependencies().plugableConfig}>
                <Router
                    server={true}
                    location={req.originalUrl}
                    context={context}
                    routes={routes}
                />
            </PlugableProvider>
        </Provider>,
    );

    const helmet = Helmet.renderStatic();

    return template(body, helmet, store, req, res);
};

module.exports = template => renderer(template);
