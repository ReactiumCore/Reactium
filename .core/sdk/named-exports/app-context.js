import React, { useEffect, useState } from 'react';
import { Registry, registryFactory } from '@atomic-reactor/reactium-sdk-core';

/**
 * @api {Object} Reactium.AppContext Reactium.AppContext
 * @apiGroup Reactium
 * @apiName Reactium.AppContext
 * @apiDescription A Registry used for top-level React wrapping context provider, such as Redux or Theme. See [Registry](#api-Reactium-Registry) for full details on Registry methods / properties.
 * Use this to register a React context provider, as well as any properties that are passed to the context.
 *
 * @apiParam {Getter} list get list of most recent (or highest order) registered objects, filtering out unregistered or banned objects.
 * @apiParam {Method} register `reg.register(id,data)` pass an identifier and a data object to register the object. The identifier will be added if it is not already registered (but protected) and not banned.
 * @apiParam (register) {String} id the id of the data object to be registered
 * @apiParam (register) {Provider} data the object to be registered
 * @apiParam (Provider) {ContextProvider} provider the context provider. This provider must be a React component that will render children.
 * @apiParam {Method} unregister `reg.unregister(id)` pass an identifier to unregister an object. When in HISTORY mode (default), previous registration will be retained, but the object will not be listed. In CLEAN mode, the previous registrations will be removed, unless protected.
 * @apiExample reactium-hooks.js
// Example of Registering Material UI Theme
import Reactium from 'reactium-core/sdk';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

(async () => {
    await Reactium.Plugin.register('MUI-Theme');

    await Reactium.Hook.register('app-context-provider', async () => {
        const theme = createTheme({
            palette: {
                primary: {
                    // Purple and green play nicely together.
                    main: purple[500],
                },
                secondary: {
                    // This is green.A700 as hex.
                    main: '#11cb5f',
                },
            },
        });

        Reactium.AppContext.register('ThemeProvider', {
            // provider required
            provider: ThemeProvider,

            // remainder are optional props passed to your provider, in this case the theme
            theme,
        });
    })
})();
 */
export const AppContext = registryFactory(
    'AppContext',
    'name',
    Registry.MODES.CLEAN,
);

const Provider = ({ children }) => {
    return children;
};

export const AppContexts = ({ children }) => {
    const [, update] = useState(new Date());
    useEffect(() => {
        return AppContext.subscribe(() => update(new Date()));
    }, []);

    return AppContext.list.reduce(
        (content, { name, order, provider: ContextProvider, ...props }) => {
            return (
                <ContextProvider key={`provider-${name}`} {...props}>
                    {content}
                </ContextProvider>
            );
        },
        <Provider>{children}</Provider>,
    );
};
