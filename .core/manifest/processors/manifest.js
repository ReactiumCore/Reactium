module.exports = data => {
    const types = Object.entries(data.manifest).map(([name, typeDomains]) => {
        const domainRegExp = new RegExp(`\/([A-Za-z_0-9]+?)\/[A-Za-z_0-9]+$`);
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
        const { modulePath, filePattern } = pattern;
        return {
            context,
            modulePath,
            filePattern,
        };
    });

    return {
        types,
        contexts,
        contextObj: JSON.stringify(data.contexts, null, 2),
        manifest: JSON.stringify(data.manifest, null, 2),
    };
};
