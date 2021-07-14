import Reactium, {
    hookableComponent,
    isBrowserWindow,
} from 'reactium-core/sdk';
import _ from 'underscore';
import RoutedContent from './RoutedContent';
import deps from 'dependencies';

Reactium.Hook.register(
    'routes-init',
    async Routing => {
        const allRoutes = await deps().loadAllDefaults('allRoutes');
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

        const combinedRoutes = _.chain(
            Object.values(allRoutes || {})
                .concat(globalRoutes)
                .filter(route => route)
                .map(route => _.flatten([route])),
        )
            .flatten()
            .compact()
            .value();

        for (const route of combinedRoutes) {
            const paths = _.compact(_.flatten([route.path]));
            for (const path of paths) {
                await Reactium.Routing.register(
                    {
                        ...route,
                        path,
                    },
                    false,
                );
            }
        }
    },
    Reactium.Enums.priority.highest,
    'REACTIUM_ROUTES_INIT',
);

Reactium.Hook.register(
    'register-route',
    async route => {
        if (typeof route.component === 'string') {
            route.component = hookableComponent(route.component);
        }

        return route;
    },
    Reactium.Enums.priority.highest,
    'REACTIUM_REGISTER_ROUTE',
);

Reactium.Component.register('RoutedContent', RoutedContent);
