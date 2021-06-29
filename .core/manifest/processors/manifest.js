const op = require('object-path');
const fs = require('fs');
const path = require('path');
const rootPath = path.resolve(__dirname, '../../..');
const chalk = require('chalk');
module.exports = data => {
    const types = Object.entries(data.manifest).map(([name, typeDomains]) => {
        const domainRegExp = new RegExp('/([A-Za-z_0-9-]+?)/[A-Za-z_0-9-]+$');
        const { imports, type } = typeDomains;

        const fileToDomain = file => {
            let [, domain] = file.match(domainRegExp) || [];
            try {
                const relativeOriginalPath = path.resolve(
                    rootPath,
                    typeDomains.originals[file],
                );
                const potentialDomainFile = path.normalize(
                    path.dirname(relativeOriginalPath) + '/domain.js',
                );
                if (fs.existsSync(potentialDomainFile)) {
                    const { name } = require(potentialDomainFile);
                    if (name) domain = name;
                }
            } catch (error) {
                // intentionally blank
            }

            if (!domain)
                console.log(
                    `Warning: Unable to add "${file}" of type "${type}. No domain.js found."`,
                );
            return domain;
        };

        const domains = [];
        imports
            .map(file => file.replace(/\\/g, '/'))
            .filter(fileToDomain)
            .forEach(file => {
                const domain = fileToDomain(file);
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
