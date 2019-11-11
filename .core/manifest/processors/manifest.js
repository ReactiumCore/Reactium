const op = require('object-path');
const fs = require('fs');
const path = require('path');
const rootPath = path.resolve(__dirname, '../../..');
const chalk = require('chalk');
module.exports = data => {
    const types = Object.entries(data.manifest).map(([name, typeDomains]) => {
        const domainRegExp = new RegExp(`\/([A-Za-z_0-9-]+?)\/[A-Za-z_0-9-]+$`);
        const { imports, type } = typeDomains;

        const domains = imports
            .map(file => file.replace(/\\/g, '/'))
            .filter(file => file.match(domainRegExp))
            .reduce((domains, file) => {
                let [, domain] = file.match(domainRegExp);
                try {
                    const relativeOriginalPath = path.resolve(
                        rootPath,
                        typeDomains.originals[file],
                    );
                    const potentialDomainFile = path.normalize(
                        path.dirname(relativeOriginalPath) + '/domain.js',
                    );
                    const { name } = require(potentialDomainFile);
                    if (name) domain = name;
                } catch (error) {
                    // intentionally blank
                }

                let existing;
                if (
                    (existing = domains.find(({ domain: d }) => d === domain))
                ) {
                    console.warn(
                        chalk.magenta(
                            `Warning: Unable to add "${file}" of type "${type}" to "${domain}" manifest. "${existing.file}" will be used.`,
                        ),
                    );
                    return domains;
                }

                domains.push({
                    domain,
                    file,
                });

                return domains;
            }, []);

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
