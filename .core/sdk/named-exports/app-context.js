import * as React from 'react';
import { Registry, registryFactory } from '@atomic-reactor/reactium-sdk-core';

export const AppContext = registryFactory(
    'AppContext',
    'name',
    Registry.MODES.CLEAN,
);

const Provider = ({ children }) => {
    return children;
};

export const AppContexts = ({ children }) => {
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
