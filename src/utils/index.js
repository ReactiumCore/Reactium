import globby from 'globby';
import path from 'path';

export const globDefineFiles = pattern => globby.sync(pattern)
    .reduce((files, f) => {
        let cmp = path.basename(path.parse(f).dir);
        files[cmp] = f.replace(/^src\/app/, '.').replace(/.js$/, '');
        return files;
    }, {});
