import Reactium, { isBrowserWindow } from 'reactium-core/sdk';
import React, { forwardRef } from 'react';
import op from 'object-path';
import _ from 'underscore';
import getComponents from 'dependencies/getComponents';
import RoutedContent from './RoutedContent';
import manifestLoader from 'manifest';

const lookupRouteComponent = async route => {
    let Found;
    if (typeof route.component === 'string') {
        route.component = Reactium.Component.get(
            route.component,
            op.get(
                getComponents([{ type: route.component }]),
                route.component,
                forwardRef(() => null),
            ),
        );
    }

    return route;
};

Reactium.Hook.register(
    'routes-init',
    async Routing => {
        const allRoutes = op.get(manifestLoader.get(), 'allRoutes', {});

        if (!Object.values(allRoutes || {}).length) {
            return [];
        }

        let globalRoutes = [];
        if (isBrowserWindow()) {
            if ('routes' in window && Array.isArray(window.routes)) {
                globalRoutes = window.routes;
            }
        } else {
            if ('routes' in global && Array.isArray(global.routes)) {
                globalRoutes = global.routes;
            }
        }

        _.chain(
            Object.values(allRoutes || {})
                .concat(globalRoutes)
                .filter(route => route)
                .map(route => _.flatten([route])),
        )
            .flatten()
            .compact()
            .value()
            .forEach(route => {
                const paths = _.compact(_.flatten([route.path]));
                paths.forEach(path => {
                    Reactium.Routing.register(
                        {
                            ...route,
                            path,
                        },
                        false,
                    );
                });
            });
    },
    Reactium.Enums.priority.highest,
);

Reactium.Hook.register('register-route', lookupRouteComponent);

let { NotFound = null } = getComponents([{ type: 'NotFound' }]);
if (NotFound !== null)
    Reactium.Component.register(
        'NotFound',
        NotFound,
        Reactium.Enums.priority.highest,
    );

Reactium.Component.register('RoutedContent', RoutedContent);
