import {
    isBrowserWindow,
    useHookComponent,
} from '@atomic-reactor/reactium-sdk-core';
import React, { Suspense, lazy } from 'react';
import manifestLoader from 'manifest';

const hookableComponent = name => props => {
    const Component = useHookComponent(name);
    return <Component {...props} />;
};

export default (elms = []) =>
    elms.reduce((cmps, { type, path }) => {
        if (path) console.warn('path no longer supported in getComponents');
        cmps[type] = hookableComponent(type);
        return cmps;
    }, {});
