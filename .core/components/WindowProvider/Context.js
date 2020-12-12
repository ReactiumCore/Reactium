import { createContext } from 'react';
import { isBrowserWindow } from 'reactium-core/sdk';

export default createContext({
    iWindow: isBrowserWindow() ? window : undefined,
    iDocument: isBrowserWindow() ? document : undefined,
});
