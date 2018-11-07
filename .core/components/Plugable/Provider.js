/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, Fragment } from 'react';
import PlugableContext from './Context';
import deps from 'dependencies';
import op from 'object-path';

/**
 * -----------------------------------------------------------------------------
 * React Component: Plugable
 * -----------------------------------------------------------------------------
 */

export default class PlugableProvider extends Component {
    constructor(props) {
        super(props);
        this.allPlugins = [].concat(props.plugins).reduce((plugins, plugin) => {
            const zone = op.get(plugins, plugin.zone, []);
            plugins[plugin.zone] = zone
                .concat([plugin])
                .sort((a, b) => a.order - b.order);
            return plugins;
        }, deps.plugins);
    }

    render() {
        return (
            <PlugableContext.Provider value={this.allPlugins}>
                {this.props.children}
            </PlugableContext.Provider>
        );
    }
}
PlugableProvider.defaultProps = {
    plugins: [],
};
