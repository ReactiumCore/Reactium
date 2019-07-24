/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { Component, useContext } from 'react';
import Context from './Context';
import op from 'object-path';
import getComponents from 'dependencies/getComponents';
import { useSelect } from 'reactium-core/easy-connect';
import _ from 'underscore';

const findComponent = (type, path, paths) => {
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
};

const resolveZone = ({
    zone,
    plugins,
    providedFilter,
    localFilterOverride,
    providedMapper,
    localMapperOverride,
    providedSort,
    localSortOverride,
    props,
}) => {
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

    const combined = useCombinedZonePlugins(plugins, zone);

    const PluginComponents = combined
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
                    Component = findComponent(component, path, paths);
                }
                PluginComponents[name] = {
                    Component,
                    id,
                    key: id,
                    ...pluginProps,
                    ...props,
                };

                return PluginComponents;
            },
            {},
        );

    return PluginComponents;
};

export const usePlugins = props => {
    const {
        plugins,
        filter: providedFilter,
        mapper: providedMapper,
        sort: providedSort,
    } = useContext(Context) || {};

    const {
        children,
        zone,
        filter: localFilterOverride,
        mapper: localMapperOverride,
        sort: localSortOverride,
        ...otherProps
    } = props;

    return resolveZone({
        zone,
        plugins,
        providedFilter,
        localFilterOverride,
        providedMapper,
        localMapperOverride,
        providedSort,
        localSortOverride,
        props: otherProps,
    });
};

const pluginZones = ({ zone }) => {
    let zones = [];
    if (Array.isArray(zone)) {
        zones = zones.concat(zone);
    } else {
        zones.push(zone);
    }
    return zones.filter(_ => _);
};

const useCombinedZonePlugins = (plugins = [], zone) => {
    const zoneFilter = plugin => pluginZones(plugin).find(pz => pz === zone);
    const mapId = plugin => plugin.id;
    const reduxPlugins = useSelect({
        select(state) {
            return Object.values(op.get(state, 'Plugable.byId', {})).filter(
                zoneFilter,
            );
        },

        shouldUpdate({ prevState = [], newState = [] }) {
            const prevIds = prevState.map(mapId);
            const newIds = newState.map(mapId);
            const same = _.intersection(prevIds, newIds);
            return (
                same.length !== newIds.length || same.length != prevIds.length
            );
        },
    });

    return plugins
        .concat(reduxPlugins)
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
        .filter(zoneFilter);
};

export const SimplePlugins = props => {
    const plugins = usePlugins(props);

    return Object.values(plugins).map(plugin => {
        const { Component, ...props } = plugin;
        return Component && <Component {...props} />;
    });
};

const PassThroughPlugins = ({ children, components }) => {
    return React.Children.map(children, Child => {
        return React.cloneElement(Child, {
            components,
        });
    });
};

/**
 * -----------------------------------------------------------------------------
 * React Component: Plugins
 * -----------------------------------------------------------------------------
 */
const Plugins = props => {
    const { children, passThrough = false } = props;
    const components = <SimplePlugins {...props} />;
    return (
        <>
            {!passThrough && components}
            {passThrough ? (
                <PassThroughPlugins
                    children={children}
                    components={components}
                />
            ) : (
                children
            )}
        </>
    );
};

export default Plugins;
