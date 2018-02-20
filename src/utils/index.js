const path = require('path');

const globDefineFiles = (matches = []) => {
    if ( matches.length ) {
        return matches
        .reduce((files, f) => {
            let cmp = path.basename(path.parse(f).dir);
            files[cmp] = f.replace(/^src\/app/, '.').replace(/.js$/, '');
            return files;
        }, {});
    }
    return {};
};

module.exports = {
    globDefineFiles,
};
