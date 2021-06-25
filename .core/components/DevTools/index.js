import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

export default () => {
    const DevTools = useHookComponent('DevTools');
    return <DevTools />;
};
