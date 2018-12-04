import deps from 'dependencies';

export default {
    addPlugin: ({ id, component, zone, order = 0, ...pluginProps }) => ({
        type: deps.actionTypes.ADD_PLUGIN,
        id,
        component,
        zone,
        order,
        ...pluginProps,
    }),

    updatePlugin: ({ id, ...pluginProps }) => ({
        type: deps.actionTypes.UPDATE_PLUGIN,
        id,
        ...pluginProps,
    }),

    deletePlugin: id => ({
        type: deps.actionTypes.DELETE_PLUGIN,
        id,
    }),
};
