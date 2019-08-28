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

const usePluginControls = ({
    zone,
    globalFilter,
    localFilterOverride,
    globalMapper,
    localMapperOverride,
    globalSort,
    localSortOverride,
}) => {
    let controls = {
        mappers: {
            default: {
                order: 0,
                mapper: _ => _,
            },
        },
        filters: {
            default: {
                order: 0,
                filter: _ => true,
            },
        },
        sorts: {
            default: {
                order: 0,
                sort: _ => 0,
            },
        },
    };

    if (typeof globalMapper === 'function') {
        controls.mappers.default = {
            order: 0,
            mapper: globalMapper,
        };
    }

    if (typeof localMapperOverride === 'function') {
        controls.mappers.default = {
            order: 0,
            mapper: localMapperOverride,
        };
    }

    if (typeof globalFilter === 'function') {
        controls.filters.default = {
            order: 0,
            filter: globalFilter,
        };
    }

    if (typeof localFilterOverride === 'function') {
        controls.filters.default = {
            order: 0,
            filter: localFilterOverride,
        };
    }

    if (typeof globalSort === 'function') {
        controls.sorts.default = {
            order: 0,
            sort: globalSort,
        };
    }

    if (typeof localSortOverride === 'function') {
        controls.sorts.default = {
            order: 0,
            sort: localSortOverride,
        };
    }

    const allPluginControls = useSelect({
        select: state => op.get(state, 'Plugable.controls', {}),
    });

    // add addons controls to this plugin zone
    controls = Object.entries(allPluginControls).reduce(
        (controls, [name, addonControls]) => {
            const { pluginMappers, pluginFilters, pluginSorts } = addonControls;

            const mapper = pluginMappers.find(
                ({ zone: pluginZone }) => zone === pluginZone,
            );
            if (mapper) controls.mappers[name] = { order: 0, ...mapper };

            const filter = pluginFilters.find(
                ({ zone: pluginZone }) => zone === pluginZone,
            );
            if (filter) controls.filters[name] = { order: 0, ...filter };

            const sort = pluginSorts.find(
                ({ zone: pluginZone }) => zone === pluginZone,
            );
            if (sort) controls.sorts[name] = { order: 0, ...sort };
            return controls;
        },
        controls,
    );

    const controlSort = (ca, cb) =>
        ca.order < cb.order ? -1 : ca.order > cb.order ? 1 : 0;
    controls.mappers = Object.values(controls.mappers).sort(controlSort);
    controls.filters = Object.values(controls.filters).sort(controlSort);
    controls.sorts = Object.values(controls.sorts).sort(controlSort);

    return controls;
};

const resolveZone = ({ zone, plugins, controls, props }) => {
    let PluginComponents = useCombinedZonePlugins(plugins, zone);
    controls.mappers.forEach(
        ({ mapper }) => (PluginComponents = PluginComponents.map(mapper)),
    );
    controls.filters.forEach(
        ({ filter }) => (PluginComponents = PluginComponents.filter(filter)),
    );
    controls.sorts.forEach(
        ({ sort }) => (PluginComponents = PluginComponents.sort(sort)),
    );

    PluginComponents = PluginComponents.reduce(
        (PluginComponents, { id, component, path, paths, ...pluginProps }) => {
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
        filter: globalFilter,
        mapper: globalMapper,
        sort: globalSort,
    } = useContext(Context) || {};

    const {
        children,
        zone,
        filter: localFilterOverride,
        mapper: localMapperOverride,
        sort: localSortOverride,
        ...otherProps
    } = props;

    const controls = usePluginControls({
        zone,
        globalFilter,
        localFilterOverride,
        globalMapper,
        localMapperOverride,
        globalSort,
        localSortOverride,
    });

    return resolveZone({
        zone,
        plugins,
        controls,
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
