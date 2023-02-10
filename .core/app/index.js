/**
 * -----------------------------------------------------------------------------
 * Includes
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import _ from 'underscore';
import deps from 'dependencies';
import 'externals';

const loadFramework = async () => {
    console.log('Loading Core SDK');
    const { default: Reactium } = await import('reactium-core/sdk');

    console.log('Initializing Application Hooks');

    await deps().loadAll('allHooks');

    /**
     * @api {Hook} sdk-init sdk-init
     * @apiName sdk-init
     * @apiDescription Called after reactium-hooks.js DDD artifacts are loaded, to allow
     * the Reactium SDK singleton to be extended before the init hook.
     * @apiGroup Hooks
     */
    await Reactium.Hook.run('sdk-init', Reactium);
    Reactium.Hook.runSync('sdk-init', Reactium);

    /**
     * @api {Hook} init init
     * @apiName init
     * @apiDescription Called before all other hooks on Reactium application startup. async only - used in
     front-end
     * @apiGroup Hooks
     */
    await Reactium.Hook.run('init');

    /**
     * @api {Hook} dependencies-load dependencies-load
     * @apiName dependencies-load
     * @apiDescription Called after init to give an application a change to load
     async dependencies. Many Domain Driven Design (DDD) artifacts from generated src/manifest.js are loaded on this hook
     async only - used in front-end
     * @apiGroup Hooks
     */
    await Reactium.Hook.run('dependencies-load');

    /**
     * @api {Hook} zone-defaults zone-defaults
     * @apiName zone-defaults
     * @apiDescription Called after dependencies-load by Reactium.Zone.init() for
     loading default component rendering Zone controls and components.
     async only - used in front-end
     * @apiParam {Object} context used to create initial controls and components.
     controls.filter for default filtering, controls.sort for default sorting, controls.mapper for default mapping
     and controls.components for initial registered components. zone.js Domain Driven Design (DDD) artifacts from generated src/manifest.js
     are registered with Reactium.Zone at this time. See Reactium.Zone SDK for runtime operations.
     * @apiGroup Hooks
     */
    // Note: zone-defaults is run from @atomic-reactor/reactium-sdk-core inside Zone.init()
    await Reactium.Zone.init();

    /**
     * @api {Hook} plugin-dependencies plugin-dependencies
     * @apiName plugin-dependencies
     * @apiDescription Called to indicate all bootstrap dependencies should now be loaded, but before application routes have been initialized.
     There are 2 default registered callback in Reactium core on this hook.
     1. (Highest Priority): The generated src/manifest.js dependencies are attached
     to this hook context (as context.deps).
     2. (High Priority): `plugin-init` hook will be invoked, at which point all Reactium.Plugin registrations will be called.

     Any hooks that registered after Reactium.Plugin will only be useful if they happen to be invoked during the normal runtime operations of the application.
     An important exception to this is `routes-init`, which is deferred until after plugins initialize so they may dynamically add routes before Reactium hands off
     control to the Router.
     async only - used in front-end
     * @apiParam {Object} context Core attaches generated manifest loaded dependencies to context.deps
     * @apiGroup Hooks
     */
    await Reactium.Hook.run('plugin-dependencies');
    await Reactium.Routing.load();

    /**
     * @api {Hook} plugin-ready plugin-ready
     * @apiName plugin-ready
     * @apiDescription Called after all plugin registration callbacks have completed and routes have loaded.
     * @apiGroup Hooks
     */
    await Reactium.Hook.run('plugin-ready');
};

/**
 * -----------------------------------------------------------------------------
 * @function App()
 * @description Scan DOM for <Component> elements and render React components
 * inside of them.
 * -----------------------------------------------------------------------------
 */
export const App = async () => {
    const {
        default: Reactium,
        hookableComponent,
        Zone,
        AppContexts,
    } = await import('reactium-core/sdk');

    await loadFramework();

    /**
     * @api {Hook} component-bindings component-bindings
     * @apiName component-bindings
     * @apiDescription Called after plugin and routing initialization to define element and dynamic component for
     one-off component bindings to the DOM. e.g. In development mode, used to render Redux Dev tools.
        async only - used in front-end application only
        * @apiParam {Object} context context.bindPoints MUST be an array of binding objects after this hook is called
        * @apiParam (binding) {HTMLElement} the DOM element to bind to (e.g. document.getElementById('my-element'))
        * @apiParam (binding) {String} string matching a React component module in one of the Reactium built-in webpack contexts
        (src/app/components or src/app/components/common-ui) e.g. 'DevTools' maps to src/app/components/DevTools
        * @apiGroup Hooks
        */
    const { bindPoints } = await Reactium.Hook.run('component-bindings');

    /**
     * @api {Hook} app-context-provider app-context-provider
     * @apiName app-context-provider
     * @apiDescription Called after app-bindpoint to define any React context providers, using the [Reactium.AppContext](#api-Reactium-Reactium.AppContext) registry.
     * @apiGroup Hooks
     */
    await Reactium.Hook.run('app-context-provider');

    // Render the React Components
    if (bindPoints.length > 0) {
        const { createRoot } = await import('react-dom/client');

        console.log('Binding components.');
        for (const { type, Component, Element } of bindPoints) {
            if (type === 'App') {
                /**
                 * @api {Hook} app-router app-router
                 * @apiName app-router
                 * @apiDescription Called after app-context-provider to define the registered Router component (i.e. `Reactium.Component.register('Router'...)`).
                 After this hook, the ReactDOM bindings will actually take place.
                async only - used in front-end application only
                * @apiGroup Hooks
                */
                await Reactium.Hook.run('app-router');

                const Router = hookableComponent('Router');
                const { message = [] } = await Reactium.Hook.run(
                    'app-boot-message',
                );

                console.log(...message);

                createRoot(Element).render(
                    <AppContexts>
                        <Zone zone='reactium-provider' />
                        <Router history={Reactium.Routing.history} />
                        <Zone zone='reactium-provider-after' />
                    </AppContexts>,
                );

                /**
                 * @api {Hook} app-ready app-ready
                 * @apiDescription The final hook run after the front-end application has bee bound or hydrated. After this point,
                 the all hooks are runtime hooks.
                * @apiName app-ready
                * @apiGroup Hooks
                */
            } else {
                // createRoot(Element).render(<Component />);
                createRoot(Element).render(
                    <AppContexts>
                        <Component />
                    </AppContexts>,
                );
            }
        }

        _.defer(() => Reactium.Hook.run('app-ready'));
    }
};

export const AppError = async error => {
    console.error(error);
};
