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
        const { children } = this.props;

        return (
            <>
                <Context.Consumer>
                    {context => this.renderPlugins(context)}
                </Context.Consumer>
                {children}
            </>
        );
    }

    renderPlugins({ plugins, filter: providedFilter, mapper: providedMapper }) {
        const {
            children, // to discard
            zone,
            filter: localFilterOverride,
            mapper: localMapperOverride,
            ...otherProps
        } = this.props;

        let pluginFilter = _ => true;
        if (typeof providedFilter === 'function') {
            pluginFilter = providedFilter;
        }
        if (typeof localFilterOverride === 'function') {
            pluginFilter = localFilterOverride;
        }

        let pluginMapper = _ => true;
        if (typeof providedMapper === 'function') {
            pluginMapper = providedMapper;
        }
        if (typeof localMapperOverride === 'function') {
            pluginMapper = localMapperOverride;
        }

        const PluginComponents = op
            .get(plugins, zone, [])
            .filter(pluginFilter)
            .map(pluginMapper)
            .map(({ id, component, path, paths, ...pluginProps }) => {
                let Component = component;
                if (typeof component === 'string') {
                    Component = Plugins.findComponent();
                }
                return (
                    Component && (
                        <Component
                            id={id}
                            key={id}
                            {...pluginProps}
                            {...otherProps}
                        />
                    )
                );
            });

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
                }))
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
};
