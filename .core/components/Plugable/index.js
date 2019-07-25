/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import PlugableContext from './Context';
import PlugableProvider from './Provider';
import Plugins, { usePlugins, SimplePlugins } from './Plugins';

export {
    usePlugins,
    Plugins,
    SimplePlugins,
    PlugableContext,
    PlugableProvider,
};
