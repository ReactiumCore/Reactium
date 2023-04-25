import 'reactium-core/components/Router/reactium-hooks';
import op from 'object-path';
import _ from 'underscore';
import deps from 'dependencies';

import('reactium-core/sdk').then(
    async ({ default: Reactium, ReactiumSyncState }) => {
        Reactium.Hook.register(
            'component-bindings',
            async context => {
                const { hookableComponent } = await import('reactium-core/sdk');

                // Placeholder for the bindable elements
                const bindPoints = [];

                const elements = Array.from(
                    document.querySelectorAll('[data-reactium-bind]'),
                );

                if (elements.length > 0) {
                    let types = [];
                    for (const Element of elements) {
                        const type = Element.getAttribute('data-reactium-bind');
                        const Component = hookableComponent(type);
                        bindPoints.push({ type, Element, Component });
                    }
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

        Reactium.Hook.register(
            'app-router',
            async () => {
                const { Router } = await import(
                    'reactium-core/components/Router'
                );
                Reactium.Component.register('Router', Router);
                console.log('Defining Router.');
            },
            Reactium.Enums.priority.highest,
            'REACTIUM_APP_ROUTER',
        );

        Reactium.Hook.register(
            'app-boot-message',
            context => {
                context.message = [
                    `%c [Reactium] %c⚡💡 %cBinding Reactium. %c⚡💡 `,
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

        Reactium.Hook.register(
            'sdk-init',
            async Reactium => {
                Reactium.State = new ReactiumSyncState(
                    op.get(window, 'state', {}),
                );
            },
            Reactium.Enums.priority.highest,
            'REACTIUM_STATE_INIT',
        );
    },
);

/**
 * @api {Hook} dependencies-load dependencies-load
 * @apiName dependencies-load
 * @apiDescription Called after init to give an application a change to load
 async dependencies. Many Domain Driven Design (DDD) artifacts from generated src/manifest.js are loaded on this hook
 async only - used in front-end
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
| app-context-provider | Called to define React application-wrapping context providers, such as Redux / Theme, etc. |
| app-router | Called to provide the React router component |
| app-boot-message | Called to define the javascript console boot message |
| app-ready | Called when the application is being bound or hydrated by ReactDOM |
 * @apiGroup Hooks
 */
