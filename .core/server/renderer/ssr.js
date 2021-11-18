import React from 'react';
import { Helmet } from 'react-helmet';
import { renderToString } from 'react-dom/server';
import op from 'object-path';
import fs from 'fs-extra';
import path from 'path';
import { matchRoutes } from 'react-router-config';
import Router from 'reactium-core/components/Router/server';
import {
    Zone,
    AppContexts,
    Handle,
    ReactiumSyncState,
} from 'reactium-core/sdk';
import uuid from 'uuid/v4';

const app = {};
app.dependencies = global.dependencies;

const renderer = async (req, res, context) => {
    req.store = ReactiumBoot.store;

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
        if (
            req.store &&
            'thunk' in route &&
            typeof route.thunk === 'function'
        ) {
            const maybeThunk = route.thunk(route.params, route.query);
            if (typeof maybeThunk === 'function')
                data = await Promise.resolve(
                    maybeThunk(
                        req.store.dispatch,
                        req.store.getState,
                        req.store,
                    ),
                );
            else data = await Promise.resolve(maybeThunk);
        }

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
                    location={req.originalUrl}
                    context={context}
                    routes={routes}
                />
                <Zone zone='reactium-provider-after' />
            </AppContexts>,
        );

        req.content = content;

        await ReactiumBoot.Hook.run('ssr-after-render', {
            data,
            route,
            req,
        });

        await ReactiumBoot.Hook.run('app-ready', true);

        req.helmet = Helmet.renderStatic();

        const html = req.template(content, req, res);

        // Server Side Generation - Conditionally Caching Routed Components markup
        const loadPaths = op.get(
            route,
            'component.loadPaths',
            op.get(route, 'loadPaths'),
        );
        if (loadPaths) {
            const ssgPaths = (await loadPaths(route)) || [];

            if (Array.isArray(ssgPaths) && ssgPaths.includes(req.originalUrl)) {
                const staticHTMLPath = path.normalize(
                    staticHTML + req.originalUrl,
                );
                fs.ensureDirSync(staticHTMLPath);
                fs.writeFileSync(
                    path.resolve(staticHTMLPath, 'index.html'),
                    html,
                    'utf8',
                );
            }
        }

        return html;
    } catch (error) {
        ERROR('Page data loading error.', error);
    }
};

module.exports = renderer;
