import op from 'object-path';

export default {
    /**
     * Default plugin filter
     *
     * Given to PluginProvider to determine by default what plugins are displayed.
     * Useful for example when you want to provide access controls.
     *
     * Can be overriden per <Plugins /> component.
     *
     * @param  {Object} plugin
     * @return {Boolean} true to keep plugin, false to remove it
     */
    filter: plugin => true,

    /**
     * Default plugin mapper. Useful for adding additional global context to
     * each plugin.
     *
     * Can be overriden per <Plugins /> component.
     *
     * @param  {Object} plugin
     * @return {Object} the modified plugin
     */
    mapper: plugin => plugin,

    /**
     * Default plugin sort compare function
     *
     * Can be overriden per <Plugins /> component.
     *
     * @param  {Object} pluginA
     * @param  {Object} pluginB
     * @return negative, zero, or positive value, @see array sort compare functions
     */
    sort: (pluginA, pluginB) => {
        const aOrder = op.get(pluginA, 'order', 0);
        const bOrder = op.get(pluginB, 'order', 0);

        return aOrder - bOrder;
    },
};
