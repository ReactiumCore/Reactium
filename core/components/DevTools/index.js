/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { createDevTools } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
import LogMonitor from 'redux-devtools-log-monitor';

/**
 * -----------------------------------------------------------------------------
 * React Component: DevTools
 * -----------------------------------------------------------------------------
 */
let DevTools = () => { return null; };

if (process.env.NODE_ENV === 'development') {
    DevTools = createDevTools(
        <DockMonitor
            defaultIsVisible={false}
            toggleVisibilityKey="ctrl-h"
            changePositionKey="ctrl-q"
            changeMonitorKey="ctrl-m">
            <LogMonitor />
        </DockMonitor>
    );
}

export default DevTools;
