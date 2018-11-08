const fs = require('fs');
const path = require('path');
const rootPath = path.resolve(__dirname, '..');

module.exports = manifestConfigDefault => {
    let manifestConfigOverride = _ => _;
    if (fs.existsSync(`${rootPath}/manifest.config.override.js`)) {
        manifestConfigOverride = require(`${rootPath}/manifest.config.override.js`);
    }

    return manifestConfigOverride(manifestConfigDefault);
};
