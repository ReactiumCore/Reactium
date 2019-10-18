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
    callback,
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

    if (name && zone && typeof callback === 'function') {
        controls[controlType].push({
            zone,
            [type]: callback,
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

['mapper', 'filter', 'sort'].forEach(type => {
    Zone[`add${types[type]}`] = (...params) => {
        addControl(type, ...params);
    };
    Zone[`remove${types[type]}`] = (...params) => {
        removeControl(type, ...params);
    };
});

export default Zone;
