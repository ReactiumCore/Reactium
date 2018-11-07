/**
 * Rename this file to gulp.config.override.js to use it.
 */

const path = require('path');

/**
 * Passed the current gulp configuration from core
 * @param  {Object} gulpConfig the .core gulp configuration
 * @return {Object} your gulp configuration override
 */
module.exports = gulpConfig => {
    const gulpConfigOverride = Object.assign({}, gulpConfig);

    /**
     * @example
     * gulpConfigOverride.port.proxy = 3030;
     */

    return gulpConfigOverride;
};
