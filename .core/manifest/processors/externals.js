const op = require('object-path');
const fs = require('fs');
const path = require('path');
const rootPath = path.resolve(__dirname, '../../..');
const chalk = require('chalk');
module.exports = data => {
    const externals = Object.values(
        op.get(data, 'manifestConfig.pluginExternals', {}),
    ).map(external => {
        const { externalName, requirePath } = external;

        if (/^\/.*\/i?$/.test(externalName))
            return {
                ...external,
                externalName: requirePath,
                requirePath,
            };

        return external;
    });

    const externalAliases = externals.filter(
        ({ defaultAlias }) => defaultAlias,
    );

    return {
        externals,
        externalAliases,
    };
};
