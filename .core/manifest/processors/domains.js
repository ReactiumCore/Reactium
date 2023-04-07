const path = require('path');
const op = require('object-path');
const { fileToDomain } = require('../manifest-tools');
const rootPath = path.resolve(__dirname, '../../..');

module.exports = data => {
    const domains = {};
    const relative = {};

    for (const [file, original] of Object.entries(
        op.get(data, 'manifest.allDomains.originals'),
    )) {
        const relativeOriginalPath = path.resolve(rootPath, original);

        const domainObj = require(relativeOriginalPath);
        const impliedDomain = fileToDomain(file);
        const domain = op.get(domainObj, 'name', impliedDomain);

        op.set(domains, [domain], domainObj);
        op.set(domains, [domain, 'name'], domain);
        op.set(domains, [domain, 'implied'], impliedDomain);
        op.set(domains, [domain, 'original'], original);
        op.set(relative, [path.dirname(original)], domain);
    }

    return JSON.stringify({ domains, relative });
};
