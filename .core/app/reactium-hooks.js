import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'reactium-core/components/Router/reactium-hooks';
import op from 'object-path';
import _ from 'underscore';
import deps from 'dependencies';

import('reactium-core/sdk').then(
    async ({ default: Reactium, HookComponent, isServerWindow }) => {
        Reactium.Hook.register(
            'component-bindings',
            async context => {
                const { default: getComponents } = await import(
                    'dependencies/getComponents'
                );

                // Placeholder for the bindable elements
                const bindPoints = [];

                // <Component /> DOM Elements array
                const elements =
                    typeof document !== 'undefined'
                        ? Array.prototype.slice.call(
                              document.querySelectorAll('component'),
                          )
                        : [];

                if (elements.length > 0) {
                    let types = [];

                    let elms = elements.map(elm => {
                        let path = elm.getAttribute('path');
                        let type = elm.getAttribute('type');

                        types.push(type);

                        return { path, type };
                    });

                    let components = getComponents(elms);

                    elements.forEach(elm => {
                        // Get the component type
                        let type = elm.getAttribute('type');

                        if (!components.hasOwnProperty(type)) {
                            return;
                        }

                        // Get parameters from container element
                        let params = {};
                        let exclude = ['type', 'path'];
                        Object.entries(elm.attributes).forEach(
                            ([key, attr]) => {
                                key = String(key).toLowerCase();
                                if (exclude.indexOf(key) < 0) {
                                    return;
                                }
                                params[attr.name] = attr.value;
                            },
                        );

                        // Get the children from the element and pass them to the component
                        let children = elm.innerHTML;
                        if (children) {
                            params['children'] = children;
                        }

                        // Create the React element and apply parameters
                        let cmp = React.createElement(components[type], params);
                        bindPoints.push({ component: cmp, element: elm });
                        console.log('Binding components.');
                    });
                }

                context.bindPoints = bindPoints;
                return Promise.resolve();
            },
            Reactium.Enums.priority.highest,
            'REACTIUM_COMPONENT_BINDINGS',
        );

        Reactium.Hook.register(
            'plugin-dependencies',
            context => {
                // Setup plugin registration
                context.deps = deps();

                console.log('Plugin dependencies.');
                return Promise.resolve();
            },
            Reactium.Enums.priority.highest,
            'REACTIUM_PLUGIN_DEPENDENCIES',
        );

        Reactium.Hook.register(
            'app-bindpoint',
            context => {
                context.appElement = document.getElementById('router');
                return Promise.resolve();
            },
            Reactium.Enums.priority.highest,
            'REACTIUM_APP_BINDPOINT',
        );

        const getSaneZoneComponents = () => {
            return (
                // allow array of DDD zone components
                _.flatten(_.compact(Object.values(deps().plugins)), true)
                    // remove DDD zone components missing zones
                    .filter(({ zone }) => {
                        if (!zone) return false;
                        if (Array.isArray(zone) && zone.length < 1)
                            return false;
                        return true;
                    })
                    // normalize zone property
                    .map(component => {
                        let { zone } = component;
                        if (!Array.isArray(zone)) {
                            zone = [zone];
                        }
                        return {
                            ...component,
                            zone,
                        };
                    })
            );
        };

        Reactium.Hook.register(
            'zone-defaults',
            async context => {
                op.set(context, 'controls', deps().plugableConfig);
                op.set(context, 'components', getSaneZoneComponents());
                console.log('Initializing Content Zones');
            },
            Reactium.Enums.priority.highest,
            'REACTIUM_ZONE_DEFAULTS',
        );

        const NoopProvider = ({ children }) => children;
        Reactium.Hook.register(
            'app-context-provider',
            async () => {
                /**
             * @api {Hook} store-create store-create
             * @apiName store-create
             * @apiDescription Called after dependencies-load to trigger Redux store creator.
             async only - used in front-end or isomorphically when running server-side rendering mode (SSR)
            * @apiParam {Object} params params.server indicate if is store creation on the server, or in the front-end application
            * @apiParam {Object} context Core implementation of this hook will create the Redux store and set it to context.store.
            * @apiGroup Hooks
            */
                const { store } = await Reactium.Hook.run('store-create', {
                    server: isServerWindow(),
                });
                Reactium.store = store;

                const ReduxProvider = ({ store }) => (
                    <HookComponent hookName='ReduxProvider' store={store} />
                );

                Reactium.AppContext.register('ReduxProvider', {
                    provider: NoopProvider,
                    store,
                });
            },
            Reactium.Enums.priority.highest,
            'NOOP_REDUX_PROVIDER',
        );

        Reactium.Hook.register(
            'app-router',
            async () => {
                const { default: Router } = await import(
                    'reactium-core/components/Router'
                );
                Reactium.Component.register('Router', Router);
                console.log('Defining Router.');
            },
            Reactium.Enums.priority.highest,
            'REACTIUM_APP_ROUTER',
        );

        Reactium.Hook.register(
            'app-ssr-mode',
            context => {
                context.ssr = window && 'ssr' in window && window.ssr;
                return Promise.resolve();
            },
            Reactium.Enums.priority.highest,
            'REACTIUM_APP_SSR_MODE',
        );

        Reactium.Hook.register(
            'app-boot-message',
            (ssr = false, context) => {
                const mode = ssr ? 'SSR' : 'FE';
                const binding = ssr ? 'Hydrating' : 'Binding';
                context.message = [
                    `%c [Reactium] ${mode} Mode: %c⚡💡 %c${binding} Reactium. %c⚡💡 `,
                    'font-size: 16px; color: #fff; background-color: #4F82BA',
                    'font-size: 16px; color: #F4F19C; background-color: #4F82BA',
                    'font-size: 16px; color: #fff; background-color: #4F82BA',
                    'font-size: 16px; color: #F4F19C; background-color: #4F82BA',
                ];

                return Promise.resolve();
            },
            Reactium.Enums.priority.highest,
            'REACTIUM_APP_BOOT_MESSAGE',
        );
    },
);

/**
 * @api {Hook} dependencies-load dependencies-load
 * @apiName dependencies-load
 * @apiDescription Called after init to give an application a change to load
 async dependencies. Many Domain Driven Design (DDD) artifacts from generated src/manifest.js are loaded on this hook
 async only - used in front-end or isomorphically when running server-side rendering mode (SSR)
 * @apiGroup Hooks
 */

/**
 * @api {Hook} Hooks Hooks
 * @apiName Hooks
 * @apiDescription Here are the standard hooks that fire (in order) on the bootstrap of your Reactium application.
 | Hook | Description |
| :---- | :----- |
| init | Called before all other hooks on startup. |
| dependencies-load | Called while application dependencies are loaded. |
| service-worker-init | Called while service worker is loaded. |
| zone-defaults | Called while rendering zone default components are loaded. |
| store-create | Called while Redux store is being created. |
| store-created | Called after Redux store is created. |
| plugin-dependencies | Called before loading runtime plugins. |
| plugin-init | Called to initiate plugin registration. |
| routes-init | Called to initiaze React router |
| register-route | Called for each route that is registered |
| data-loaded | Called on route load to pre-load data |
| plugin-ready | Called after all plugins registration callbacks have completed |
| component-bindings | Called to sibling React components and their DOM element bindings |
| app-bindpoint | Called to define the main application bind point. |
| app-redux-provider | Called to define the Redux provider component |
| app-router | Called to provide the React router component |
| app-ssr-mode | Called to make the application aware of server-side rendering mode |
| app-boot-message | Called to define the javascript console boot message |
| app-ready | Called when the application is being bound or hydrated by ReactDOM |
 * @apiGroup Hooks
 */
