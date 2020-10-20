'use strict';

/**
 * -----------------------------------------------------------------------------
 * Includes
 * -----------------------------------------------------------------------------
 */
import Reactium, { useHookComponent } from 'reactium-core/sdk';
import React from 'react';
import ReactDOM from 'react-dom';
import 'dependencies';

const hookableComponent = name => props => {
    const Component = useHookComponent(name);
    return <Component {...props} />;
};

/**
 * -----------------------------------------------------------------------------
 * @function App()
 * @description Scan DOM for <Component> elements and render React components
 * inside of them.
 * -----------------------------------------------------------------------------
 */
export const App = async () => {
    const context = {};

    await Reactium.Hook.run('init');
    await Reactium.Hook.run('dependencies-load');
    await Reactium.Zone.init();
    const { store } = await Reactium.Hook.run('store-create', {
        server: false,
    });
    await Reactium.Hook.run('plugin-dependencies');
    await Reactium.Routing.load();

    if (typeof window !== 'undefined') {
        const { bindPoints } = await Reactium.Hook.run('component-bindings');
        const { appElement } = await Reactium.Hook.run('app-bindpoint');
        await Reactium.Hook.run('app-redux-provider');
        await Reactium.Hook.run('app-router');

        const Provider = hookableComponent('ReduxProvider');
        const Router = hookableComponent('Router');

        // Render the React Components
        if (bindPoints.length > 0) {
            bindPoints.forEach(item => {
                ReactDOM.render(
                    <Provider store={store}>{item.component}</Provider>,
                    item.element,
                );
            });
        }

        // ensure router DOM Element is on the page
        if (appElement) {
            const { ssr } = await Reactium.Hook.run('app-ssr-mode');
            const { message = [] } = await Reactium.Hook.run(
                'app-boot-message',
                ssr,
            );
            console.log(...message);

            ReactDOM[ssr ? 'hydrate' : 'render'](
                <Provider store={store}>
                    <Router history={Reactium.Routing.history} />
                </Provider>,
                appElement,
            );

            /**
             * @api {Hook} app-ready app-ready
             * @apiDescription Hook run after the app has been rendered.
             * @apiName app-ready
             * @apiGroup Reactium.Hooks
             * @apiParam {Boolean} ssr If the app is in server-side rendering mode `true` is passed to the hook.
             */
            await Reactium.Hook.run('app-ready', ssr);
        }
    }
};

export const AppError = async error => {
    const RedBox = require('redbox-react');
    const { appElement } = await Reactium.Hook.run('app-bindpoint');

    if (appElement) {
        ReactDOM.render(<RedBox error={error} />, appElement);
    }
};
