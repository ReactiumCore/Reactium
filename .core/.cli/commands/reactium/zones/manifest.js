/**
 * Return the output of the 'plugin-manifest.json' file if it exists.
 */
const fs = require('fs-extra');
const path = require('path');

module.exports = () => {
    const cwd = process.cwd();
    const dir = path.normalize(`${cwd}/.cli-cache`);
    const manifestFile = path.normalize(`${dir}/plugin-zones.json`);

    // Create the cli-cache directory
    fs.ensureDirSync(dir);

    return fs.existsSync(manifestFile)
        ? require(manifestFile)
        : {};

};
