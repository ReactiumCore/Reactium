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
 * React Component: PlugableProvider
 * -----------------------------------------------------------------------------
 */

export default class PlugableProvider extends Component {
    constructor(props) {
        super(props);
        this.allPlugins = Object.values(deps.plugins)
            .concat(props.plugins)
            .reduce((allPlugins, plugin) => {
                // support multi-use plugin
                if (Array.isArray(plugin)) {
                    return allPlugins.concat(plugin);
                }

                // support multi-zone plugin
                if (Array.isArray(plugin.zone)) {
                    return allPlugins.concat(
                        plugin.zone.map(zone => ({
                            ...plugin,
                            zone,
                        }))
                    );
                }

                allPlugins.push(plugin);
                return allPlugins;
            }, [])
            .reduce((plugins, plugin) => {
                const zone = op.get(plugins, plugin.zone, []);
                plugins[plugin.zone] = zone.concat([plugin]);
                return plugins;
            }, {});
    }

    render() {
        const { filter, sort, mapper } = this.props;

        return (
            <PlugableContext.Provider
                value={{
                    plugins: this.allPlugins,
                    filter: filter,
                    sort: sort,
                    mapper: mapper,
                }}>
                {this.props.children}
            </PlugableContext.Provider>
        );
    }
}
PlugableProvider.defaultProps = {
    plugins: [],
    filter: _ => true,
    mapper: _ => _,
    sort: (a, b) => {
        const aOrder = op.get(a, 'order', 0);
        const bOrder = op.get(b, 'order', 0);

        return aOrder - bOrder;
    },
};
