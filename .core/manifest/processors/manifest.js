const op = require('object-path');

module.exports = data => {
    const types = Object.entries(data.manifest).map(([name, typeDomains]) => {
        const domainRegExp = new RegExp(`\/([A-Za-z_0-9-]+?)\/[A-Za-z_0-9-]+$`);
        const { imports, type } = typeDomains;
        const domains = imports
            .map(file => file.replace(/\\/g, '/'))
            .filter(file => file.match(domainRegExp))
            .map(file => {
                let [, domain] = file.match(domainRegExp);
                return {
                    domain,
                    file,
                };
            });

        return {
            name,
            domains,
        };
    });

    const contexts = Object.entries(data.contexts).map(([context, pattern]) => {
        const { modulePath, filePattern, mode } = pattern;
        return {
            context,
            modulePath,
            filePattern,
            mode,
        };
    });

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
        types,
        contexts,
        externals,
        externalAliases,
        contextObj: JSON.stringify(data.contexts, null, 2),
        manifest: JSON.stringify(data.manifest, null, 2),
    };
};
