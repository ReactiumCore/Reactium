/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component } from 'react';
import Context from './Context';
import { matchPath } from 'react-router';
import op from 'object-path';
import deps, { getComponents } from 'dependencies';

/**
 * -----------------------------------------------------------------------------
 * React Component: Plugins
 * -----------------------------------------------------------------------------
 */

export default class Plugins extends Component {
    render() {
        const { children, passThrough = false } = this.props;
        return (
            <>
                <Context.Consumer>
                    {context => {
                        const plugins = this.getPlugins(context);

                        const components = Object.entries(plugins).reduce(
                            (cmps, [name, plugin]) => {
                                const { Component, ...pluginProps } = plugin;
                                cmps[name] = props => {
                                    return (
                                        Component && (
                                            <Component
                                                {...pluginProps}
                                                {...props}
                                            />
                                        )
                                    );
                                };
                                return cmps;
                            },
                            {},
                        );

                        return (
                            <>
                                {!passThrough
                                    ? this.renderPlugins(plugins)
                                    : null}
                                {React.Children.map(children, Child => {
                                    return React.cloneElement(Child, {
                                        components,
                                    });
                                })}
                            </>
                        );
                    }}
                </Context.Consumer>
            </>
        );
    }

    renderPlugins(plugins) {
        return Object.values(plugins).map(plugin => {
            const { Component, ...props } = plugin;
            return Component && <Component {...props} />;
        });
    }

    getPlugins({
        plugins,
        filter: providedFilter,
        mapper: providedMapper,
        sort: providedSort,
    }) {
        const {
            children, // to discard
            passThrough, // to discard
            zone,
            filter: localFilterOverride,
            mapper: localMapperOverride,
            sort: localSortOverride,
            ...otherProps
        } = this.props;

        let pluginFilter = _ => true;
        if (typeof providedFilter === 'function') {
            pluginFilter = providedFilter;
        }
        if (typeof localFilterOverride === 'function') {
            pluginFilter = localFilterOverride;
        }

        let pluginMapper = _ => _;
        if (typeof providedMapper === 'function') {
            pluginMapper = providedMapper;
        }
        if (typeof localMapperOverride === 'function') {
            pluginMapper = localMapperOverride;
        }

        let pluginSort = _ => 0;
        if (typeof providedSort === 'function') {
            pluginSort = providedSort;
        }
        if (typeof localSortOverride === 'function') {
            pluginSort = localSortOverride;
        }

        const PluginComponents = op
            .get(plugins, zone, [])
            .filter(pluginFilter)
            .map(pluginMapper)
            .sort(pluginSort)
            .reduce(
                (
                    PluginComponents,
                    { id, component, path, paths, ...pluginProps },
                ) => {
                    let Component = component;
                    let name = id;
                    if (typeof component === 'string') {
                        name = component;
                        Component = Plugins.findComponent(
                            component,
                            path,
                            paths,
                        );
                    }
                    PluginComponents[name] = {
                        Component,
                        id,
                        key: id,
                        ...pluginProps,
                        ...otherProps,
                    };

                    return PluginComponents;
                },
                {},
            );

        return PluginComponents;
    }

    static findComponent(type, path, paths) {
        let search = [
            {
                type,
                path: `${path}${type}`,
            },
        ];

        if (Array.isArray(paths)) {
            search = search.concat(
                paths.map(path => ({
                    type,
                    path: `${path}${type}`,
                })),
            );
        }

        const found = getComponents(search);
        let Component = null;
        if (found) {
            Component = found[type];
        }

        return Component;
    }
}

Plugins.defaultProps = {
    zone: '',
    passThrough: false,
};
