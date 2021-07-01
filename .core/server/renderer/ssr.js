import React from 'react';
import { Helmet } from 'react-helmet';
import { renderToString } from 'react-dom/server';
import op from 'object-path';
import { matchRoutes } from 'react-router-config';
import Router from 'reactium-core/components/Router/server';
import { Zone, useHookComponent } from 'reactium-core/sdk';

const app = {};
app.dependencies = global.dependencies;

const hookableComponent = name => props => {
    const Component = useHookComponent(name);
    return <Component {...props} />;
};

const renderer = async (req, res, context) => {
    const { store } = await ReactiumBoot.Hook.run('store-create', {
        server: true,
    });

    await ReactiumBoot.Hook.run('plugin-ready');

    await ReactiumBoot.Hook.run('app-redux-provider');

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
        INFO('Loading page data...');

        let data;
        if ('thunk' in route && typeof route.thunk === 'function') {
            const maybeThunk = route.thunk(route.params, route.query);
            if (typeof maybeThunk === 'function')
                data = await Promise.resolve(
                    maybeThunk(store.dispatch, store.getState, store),
                );
            else data = await Promise.resolve(maybeThunk);
        }

        await ReactiumBoot.Hook.run(
            'data-loaded',
            data,
            route,
            route.params,
            route.query,
        );
        INFO('Page data loading complete.');
    } catch (error) {
        ERROR('Page data loading error.', error);
    }

    const Provider = hookableComponent('ReduxProvider');
    const content = renderToString(
        <Provider store={store}>
            <Zone zone='reactium-provider' />
            <Router
                server={true}
                location={req.originalUrl}
                context={context}
                routes={routes}
            />
            <Zone zone='reactium-provider-after' />
        </Provider>,
    );

    req.content = content;

    await ReactiumBoot.Hook.run('app-ready', true);

    const helmet = Helmet.renderStatic();

    return req.template(content, helmet, store, req, res);
};

module.exports = renderer;
