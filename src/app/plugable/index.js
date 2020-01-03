import op from 'object-path';

export default {
    /**
     * Default plugin filter
     *
     * Given to PluginProvider to determine by default what plugins are displayed.
     * Useful for example when you want to provide access controls.
     *
     * Can be overriden per <Zone /> component.
     *
     * @param  {Object} plugin
     * @return {Boolean} true to keep plugin, false to remove it
     */
    filter: plugin => true,

    /**
     * Default plugin mapper. Useful for adding additional global context to
     * each plugin.
     *
     * Can be overriden per <Zone /> component.
     *
     * @param  {Object} plugin
     * @return {Object} the modified plugin
     */
    mapper: plugin => plugin,

    /**
     * Default plugin underscore _.sortBy
     *
     * Can be overriden per <Zone /> component.
     *
     * @param  {String|Function} sortBy _.sortBy argument.
     * @param  {Boolean} reverse Reverse order
     * @return negative, zero, or positive value, @see array sort compare functions
     */
    sort: {
        sortBy: 'order',
        reverse: false,
    },
};
