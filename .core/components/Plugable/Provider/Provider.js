import React, { Component, Fragment } from 'react';
import PlugableContext, { compilePlugins } from '../Context';
import deps from 'dependencies';
import op from 'object-path';

/**
 * -----------------------------------------------------------------------------
 * React Component: PlugableProvider
 * -----------------------------------------------------------------------------
 */
export default class PlugableProvider extends Component {
    render() {
        const { filter, sort, mapper } = this.props;
        const context = {
            plugins: this.allPlugins(this.props),
            filter: filter,
            sort: sort,
            mapper: mapper,
        };

        return (
            <PlugableContext.Provider value={context}>
                {this.props.children}
            </PlugableContext.Provider>
        );
    }

    shouldComponentUpdate(nextProps) {
        const plugins = this.allPlugins(this.props);
        const nextPlugins = this.allPlugins(nextProps);

        // different number of zones
        if (Object.keys(plugins).length !== Object.keys(nextPlugins).length) {
            console.log('different number of zones');
            return true;
        }

        // different zone names
        if (
            Object.keys(plugins)
                .sort()
                .join('') !==
            Object.keys(nextPlugins)
                .sort()
                .join('')
        ) {
            return true;
        }

        let updated = false;
        Object.entries(plugins).forEach(([key, values]) => {
            // zone has different plugins
            if (
                values
                    .map(({ id }) => id)
                    .sort()
                    .join('') !==
                nextPlugins[key]
                    .map(({ id }) => id)
                    .sort()
                    .join('')
            ) {
                updated = true;
            }
        });

        return updated || false;
    }

    allPlugins(props) {
        const { plugins } = props;

        return Object.values(deps.plugins)
            .concat(plugins)
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
                        })),
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
