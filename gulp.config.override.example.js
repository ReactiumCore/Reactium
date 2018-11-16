/**
 * Rename this file to gulp.config.override.js to use it.
 */

const path = require('path');

/**
 * Passed the current gulp configuration from core
 * @param  {Object} gulpConfig the .core gulp configuration
 * @return {Object} your gulp configuration override
 */
module.exports = config => {
    const configOverride = {};

    /**
     * @example
     * configOverride.port = {
     *     // nodejs serving on port 8080 (default 3030)
     *     proxy: 8080,
     *     // browsersync proxying on 8081 (default 3000)
     *     browsersync: 8081,
     * };
     */

    return {
        ...config,
        ...configOverride,
    };
};
