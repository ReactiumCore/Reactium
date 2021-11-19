import React from 'react';
import { Helmet } from 'react-helmet';
import { renderToString } from 'react-dom/server';
import op from 'object-path';
import _ from 'underscore';
import { matchRoutes } from 'react-router-config';
import Router from 'reactium-core/components/Router/server';
import {
    Zone,
    AppContexts,
    Handle,
    ReactiumSyncState,
} from 'reactium-core/sdk';
import uuid from 'uuid/v4';

const ssrStartup = require('../../ssr-startup');

const ssr = async ({ url, query = {}, req = {}, bootHooks, appGlobals }) => {
    // prevent expensive and excessive globbing
    if (bootHooks) global.bootHooks = bootHooks;

    // apply globals inside ssr context
    _.sortBy(Object.values(appGlobals), 'order').forEach(
        ({ name, value, serverValue }) => {
            global[name] =
                typeof serverValue !== 'undefined' ? serverValue : value;
        },
    );

    const rendered = {};
    const context = {};

    await ssrStartup();

    const matches = matchRoutes(ReactiumBoot.Routing.get(), url);
    let [match] = matches;
    if (matches.length > 1) {
        match = matches.find(match => match.isExact);
    }

    const matchedRoute = op.get(match, 'route', {});
    const route = {
        ...matchedRoute,
        params: op.get(match, 'match.params', {}),
        query,
    };

    // Check for 404
    context.notFound = !matches.length || !('path' in matchedRoute);

    // Wait for loader or go ahead and render on error
    INFO('Loading page data...');

    const loadState = op.get(
        route,
        'component.loadState',
        op.get(route, 'loadState'),
    );
    const handleId = op.get(
        route,
        'component.handleId',
        op.get(route, 'handleId', uuid()),
    );

    let data;

    // for consistency
    op.set(route, 'component.handleId', handleId);
    op.set(route, 'handleId', handleId);
    op.set(context, 'handleId', handleId);
    if (typeof loadState == 'function') {
        data = await loadState({
            route,
            params: route.params,
            search: route.query,
        });
        Handle.register(handleId, {
            routeId: op.get(route, 'id'),
            current: new ReactiumSyncState(data),
        });
    }

    await ReactiumBoot.Hook.run(
        'data-loaded',
        data,
        route,
        route.params,
        route.query,
    );
    INFO('Page data loading complete.');

    await ReactiumBoot.Hook.run('ssr-before-render', {
        data,
        route,
        req,
    });

    const content = renderToString(
        <AppContexts>
            <Zone zone='reactium-provider' />
            <Router
                server={true}
                location={url}
                context={context}
                routes={routes}
            />
            <Zone zone='reactium-provider-after' />
        </AppContexts>,
    );

    rendered.content = content;

    await ReactiumBoot.Hook.run('ssr-after-render', {
        data,
        route,
        rendered,
        req,
    });

    Object.entries(req).forEach(([key, value]) => op.set(rendered, key, value));

    await ReactiumBoot.Hook.run('app-ready', true);

    const helmet = Helmet.renderStatic();
    rendered.helmet = Object.entries(helmet).reduce((helmet, [key, value]) => {
        if (typeof value.toString == 'function') {
            helmet[key] = value.toString();
        }
        return helmet;
    }, {});

    // Server Side Generation - Conditionally Caching Routed Components markup
    const loadPaths = op.get(
        route,
        'component.loadPaths',
        op.get(route, 'loadPaths'),
    );

    if (loadPaths) {
        rendered.ssgPaths = (await loadPaths(route)) || [];
    }

    process.send({ rendered, context });
};

process.on('message', async message => {
    try {
        await ssr(message);
    } catch (error) {
        console.error({ error });
    }
});
