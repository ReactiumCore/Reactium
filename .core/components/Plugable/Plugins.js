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

const usePluginControls = ({ zone, ...defaults }) => {
    const defaultControls = Object.entries({
        mapper: [
            _ => _,
            op.get(defaults, 'globalMapper'),
            op.get(defaults, 'localMapperOverride'),
        ],
        filter: [
            () => true,
            op.get(defaults, 'globalFilter'),
            op.get(defaults, 'localFilterOverride'),
        ],
        sort: [
            { sortBy: 'order', reverse: false },
            op.get(defaults, 'globalSort'),
            op.get(defaults, 'localSortOverride'),
        ],
    }).reduce((defaultControls, [type, options]) => {
        let defaultControl = _.last(_.compact(options));
        op.set(defaultControls, `${type}s.default`, {
            order: 0,
            [type]: defaultControl,
        });
        return defaultControls;
    }, {});

    const allPluginControls = useSelect({
        select: state => op.get(state, 'Plugable.controls', {}),
    });

    // add addons controls for this zone
    let controls = Object.entries(allPluginControls).reduce(
        (controls, [name, addonControls], index) => {
            Object.entries({
                mapper: op.get(addonControls, 'pluginMappers', []),
                filter: op.get(addonControls, 'pluginFilters', []),
                sort: op.get(addonControls, 'pluginSorts', []),
            }).forEach(([type, items]) => {
                const control = items.find(
                    ({ zone: pluginZone }) => zone === pluginZone,
                );
                op.set(
                    controls,
                    `${type}s.default`,
                    op.get(defaultControls, `${type}s.default`),
                );
                if (control) {
                    op.set(controls, [`${type}s`, name], control);
                }
            });

            return controls;
        },
        {},
    );

    const controlSorter = (controls = {}) => {
        let controlsEntries = Object.entries(controls);
        // remove default if controls added by plugin
        controlsEntries = controlsEntries.filter(
            ([name, control]) =>
                controlsEntries.length === 1 || name !== 'default',
        );

        return _.sortBy(controlsEntries, ([, control]) => control.order).reduce(
            (controls, [name, control]) => {
                controls[name] = control;
                return controls;
            },
            {},
        );
    };

    controls.mappers = controlSorter(controls.mappers);
    controls.filters = controlSorter(controls.filters);
    controls.sorts = controlSorter(controls.sorts);

    return controls;
};

const resolveZone = ({ zone, plugins, controls, props }) => {
    let PluginComponents = useCombinedZonePlugins(plugins, zone);
    Object.values(controls.mappers).forEach(
        ({ mapper }) => (PluginComponents = PluginComponents.map(mapper)),
    );
    Object.values(controls.filters).forEach(
        ({ filter }) => (PluginComponents = PluginComponents.filter(filter)),
    );
    Object.values(controls.sorts).forEach(({ sort }) => {
        PluginComponents = _.sortBy(PluginComponents, sort.sortBy);
        if (sort.reverse) PluginComponents = PluginComponents.reverse();
        return PluginComponents;
    });

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
    return _.compact(zones);
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
