import React from 'react';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { renderToString } from 'react-dom/server';
import querystring from 'querystring';
import op from 'object-path';
import { matchRoutes } from 'react-router-config';
import Reactium from 'reactium-core/sdk';
import 'reactium-core/redux/storeCreator';
import Router from 'reactium-core/components/Router/server';
import deps from 'dependencies';

const app = {};
app.dependencies = global.dependencies = deps;

const renderer = async (req, res, context) => {
    await Reactium.Hook.run('init');
    await Reactium.Hook.run('dependencies-load');
    await Reactium.Zone.init();
    const { store } = await Reactium.Hook.run('store-create', { server: true });
    await Reactium.Hook.run('plugin-dependencies');
    await Reactium.Routing.load();
    ('plugin-dependencies');
    const routes = Reactium.Routing.get();
    await Reactium.Hook.run('plugin-ready');

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

        let data;
        if ('thunk' in route && typeof route.thunk === 'function') {
            const maybeThunk = route.thunk(route.params, route.query);
            if (typeof maybeThunk === 'function')
                data = await Promise.resolve(
                    maybeThunk(store.dispatch, store.getState, store),
                );
            else data = await Promise.resolve(maybeThunk);
        }

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

    const content = renderToString(
        <Provider store={store}>
            <Router
                server={true}
                location={req.originalUrl}
                context={context}
                routes={routes}
            />
        </Provider>,
    );

    req.content = content;

    await Reactium.Hook.run('app-ready', true);

    const helmet = Helmet.renderStatic();

    return req.template(content, helmet, store, req, res);
};

module.exports = renderer;
