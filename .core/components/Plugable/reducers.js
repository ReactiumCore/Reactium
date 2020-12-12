export default (state = {}, action) => {
    switch (action.type) {
        case 'ADD_PLUGIN':
        case 'UPDATE_PLUGIN':
        case 'REMOVE_PLUGIN':
        case 'ADD_PLUGIN_CONTROLS':
        case 'REMOVE_PLUGIN_CONTROLS':
            console.log(
                `action ${action.type} is no longer used. See one of the following Reactium.Zone SDK functions.`,
            );
            console.log(
                `Use Reactium.Zone.addComponent() instead of dispatching the ADD_PLUGIN action type.`,
            );
            console.log(
                `Use Reactium.Zone.removeComponent() instead of dispatching the REMOVE_PLUGIN action type.`,
            );
            console.log(
                `Use Reactium.Zone.addFilter() to add a filter function to a zone where your component is rendered.`,
            );
            console.log(
                `Use Reactium.Zone.addMap() to add a mapping function to a zone where your component is rendered.`,
            );
            console.log(
                `Use Reactium.Zone.addSort() to add sortBy criteria to a zone where your component is rendered.`,
            );
        default:
            return state;
    }
    return state;
};
