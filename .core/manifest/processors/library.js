const op = require('object-path');

module.exports = data => {
    const { imports } = op.get(data.manifest, 'allLibraryComponents', {
        imports: [],
    });
    const domainRegExp = new RegExp(`\/([A-Za-z_0-9]+?)\/library$`);

    return imports
        .filter(file => domainRegExp.test(file))
        .map(file => file.replace(/\\/g, '/'))
        .map(file => {
            let [, domain] = file.match(domainRegExp);

            return {
                domain,
                file,
            };
        });
};
