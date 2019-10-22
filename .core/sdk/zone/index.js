import Plugin from '../plugin';
import { combineZones } from 'redux';
import Enums from '../enums';
import op from 'object-path';

const Zone = {};
const prematureCallError = Enums.Plugin.prematureCallError;
const types = {
    mapper: 'Mapper',
    filter: 'Filter',
    sort: 'Sort',
};

const addControl = (
    type,
    name,
    zone,
    argument,
    order = Enums.priority.neutral,
) => {
    const controlType = `plugin${types[type]}s`;

    if (!Plugin.ready) {
        console.error(
            new Error(prematureCallError(`Zone.add${types[type]}()`)),
        );
        return;
    }

    const controls = op.get(
        Plugin.redux.store.getState(),
        ['Plugable', 'controls', name],
        {
            pluginMappers: [],
            pluginFilters: [],
            pluginSorts: [],
        },
    );

    if (name && zone && argument) {
        controls[controlType].push({
            zone,
            [type]: argument,
            order,
        });

        Plugin.redux.store.dispatch(
            Plugin.deps.actions.Plugable.addControls({
                name,
                controls,
            }),
        );
    }
};

const removeControl = (type, name, zone) => {
    const controlType = `plugin${types[type]}s`;

    if (!Plugin.ready) {
        console.error(
            new Error(prematureCallError(`Zone.remove${types[type]}()`)),
        );
        return;
    }

    const controls = op.get(
        Plugin.redux.store.getState(),
        ['Plugable', 'controls', name],
        {
            pluginMappers: [],
            pluginFilters: [],
            pluginSorts: [],
        },
    );

    if (name && zone) {
        controls[controlType] = controls[controlType].filter(
            ({ zone: controlZone }) => zone !== controlZone,
        );

        Plugin.redux.store.dispatch(
            Plugin.deps.actions.Plugable.addControls({
                name,
                controls,
            }),
        );
    }
};

/**
 * @api {Function} Zone.addMapper() add map function to a plugin Zone
 * @apiName Zone.addMapper
 * @apiDescription Add a plugin zone mapping function, used to augment the plugin object before passed to `<Plugins />`
 This should be called only:
 1. within `Reactium.Plugin.register()` promise callback,
 2. or after the `plugin-dependencies` hook, (e.g. `plugin-init`)
 3. or after `Reactium.Plugin.ready === true`.
 * @apiParam {String} pluginName the unique name of your plugin
 * @apiParam {String} zone the zone this mapper will apply to
 * @apiParam {String} mapper the mapper function that will be passed each plugin object
 * @apiParam {String} [order=Enums.priority.neutral] the priority your mapper will take in list of mappers in this zone
 * @apiGroup Zone
 * @apiExample Example Usage
import Reactium from 'reactium-core/sdk';
import React from 'react';
import VIPBadge from './some/path/Vip';
// for this zone, if plugin is of type "vip", add a VIPBage component to the plugin
// components children property
const mapper = (plugin) => {
    if (plugin.type === 'vip')
    plugin.children = [
        <VIPBadge />
    ];
    return plugin;
};
Reactium.Zone.addMapper('myPlugin', 'zone-1', mapper)
 */

/**
* @api {Function} Zone.removeMapper() remove mapping functions from a plugin zone
* @apiName Zone.removeMapper
* @apiDescription Remove mapping functions for a plugin zone for this plugin.
This should be called only:
1. within `Reactium.Plugin.register()` promise callback,
2. or after the `plugin-dependencies` hook, (e.g. `plugin-init`)
3. or after `Reactium.Plugin.ready === true`.
* @apiParam {String} pluginName the unique name of your plugin
* @apiParam {String} zone the zone to remove this mapper from
* @apiGroup Zone
* @apiExample Example Usage
import Reactium from 'reactium-core/sdk';
Reactium.Zone.removeMapper('myPlugin', 'zone-1');
*/

/**
* @api {Function} Zone.addFilter() add filter function to a plugin Zone
* @apiName Zone.addFilter
* @apiDescription Add a plugin zone filter function, used to filter which plugins will appear in `<Plugins />`
This should be called only:
1. within `Reactium.Plugin.register()` promise callback,
2. or after the `plugin-dependencies` hook, (e.g. `plugin-init`)
3. or after `Reactium.Plugin.ready === true`.
* @apiParam {String} pluginName the unique name of your plugin
* @apiParam {String} zone the zone this filter will apply to
* @apiParam {String} filter the filter function that will be passed each plugin object
* @apiParam {String} [order=Enums.priority.neutral] the priority your filter will take in list of filters in this zone
* @apiGroup Zone
* @apiExample Example Usage
import Reactium from 'reactium-core/sdk';
// Hide this plugin if current user shouldn't see vip plugins
const filter = (plugin) => {
  return plugin.type !== 'vip' || Reactium.User.can('vip.view')
};
Reactium.Zone.addFilter('myPlugin', 'zone-1', filter)
*/

/**
* @api {Function} Zone.removeFilter() remove filter functions from a plugin zone
* @apiName Zone.removeFilter
* @apiDescription Remove filter functions for a plugin zone for this plugin.
This should be called only:
1. within `Reactium.Plugin.register()` promise callback,
2. or after the `plugin-dependencies` hook, (e.g. `plugin-init`)
3. or after `Reactium.Plugin.ready === true`.
* @apiParam {String} pluginName the unique name of your plugin
* @apiParam {String} zone the zone to remove this filter from
* @apiGroup Zone
* @apiExample Example Usage
import Reactium from 'reactium-core/sdk';
Reactium.Zone.removeFilter('myPlugin', 'zone-1');
*/

/**
 * @api {Function} Zone.addSort() add sort criteria to a plugin Zone
 * @apiName Zone.addSort
 * @apiDescription Add a plugin zone sort critera, used to augment the plugin object before passed to `<Plugins />`
 This should be called only:
 1. within `Reactium.Plugin.register()` promise callback,
 2. or after the `plugin-dependencies` hook, (e.g. `plugin-init`)
 3. or after `Reactium.Plugin.ready === true`.
 * @apiParam {String} pluginName the unique name of your plugin
 * @apiParam {String} zone the zone this sort will apply to
 * @apiParam {String} [sortBy=order] plugin property to sort the list of plugins by
 * @apiParam {Boolean} [reverse=false] reverse sort order
 * @apiParam {String} [order=Enums.priority.neutral] the priority your sort will take in list of sorts in this zone
 * @apiGroup Zone
 * @apiExample Example Usage
import Reactium from 'reactium-core/sdk';

// Hide this plugin if current user shouldn't see vip plugins
const sort = (plugin) => {
  return plugin.type !== 'vip' || Reactium.User.can('vip.view')
};
Reactium.Zone.addSort('myPlugin', 'zone-1', sort)
 */

/**
  * @api {Function} Zone.removeSort() remove sort functions from a plugin zone
  * @apiName Zone.removeSort
  * @apiDescription Remove sort critera for a plugin zone for this plugin.
  This should be called only:
  1. within `Reactium.Plugin.register()` promise callback,
  2. or after the `plugin-dependencies` hook, (e.g. `plugin-init`)
  3. or after `Reactium.Plugin.ready === true`.
  * @apiParam {String} pluginName the unique name of your plugin
  * @apiParam {String} zone the zone to remove this sort from
  * @apiGroup Zone
  * @apiExample Example Usage
import Reactium from 'reactium-core/sdk';
Reactium.Zone.removeSort('myPlugin', 'zone-1');
  */
['mapper', 'filter', 'sort'].forEach(type => {
    Zone[`add${types[type]}`] = (...params) => {
        addControl(type, ...params);
    };
    Zone[`remove${types[type]}`] = (...params) => {
        removeControl(type, ...params);
    };
});

Zone.addSort = (
    name,
    zone,
    sortBy = 'order',
    reverse = false,
    order = Enums.priority.neutral,
) => addControl('sort', name, zone, { sortBy, reverse }, order);

export default Zone;
