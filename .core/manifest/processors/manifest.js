const op = require('object-path');
const fs = require('fs');
const path = require('path');
const rootPath = path.resolve(__dirname, '../../..');
const chalk = require('chalk');
module.exports = data => {
    const explicitDomains = require(path.resolve(rootPath, 'src/domains.js'));

    const types = Object.entries(data.manifest).map(([name, typeDomains]) => {
        const { fileToDomain } = require('../manifest-tools');
        const { imports, type } = typeDomains;

        const mapDomain = file => {
            let domain = fileToDomain(file);
            const relative = domain;
            domain = op.get(
                explicitDomains,
                ['relative', path.dirname(typeDomains.originals[file])],
                domain,
            );

            if (!domain)
                console.log(
                    `Warning: Unable to add "${file}" of type "${type}. No domain.js found."`,
                );
            return domain;
        };

        const domains = [];
        imports
            .map(file => file.replace(/\\/g, '/'))
            .filter(mapDomain)
            .forEach(file => {
                const domain = mapDomain(file);
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
            });

        return {
            name,
            domains,
        };
    });

    return {
        types,
        manifest: JSON.stringify(data.manifest, null, 2),
    };
};
