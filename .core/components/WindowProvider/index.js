import { createContext } from 'react';
import { isBrowserWindow } from '@atomic-reactor/reactium-sdk-core';

export const Context = createContext({
    iWindow: isBrowserWindow() ? window : undefined,
    iDocument: isBrowserWindow() ? document : undefined,
});
