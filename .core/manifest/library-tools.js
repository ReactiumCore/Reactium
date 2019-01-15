const fs = require('fs-extra');
const path = require('path');
const op = require('object-path');
const gulpConfig = require('../gulp.config');
const rootPath = path.resolve(__dirname, '../..');

const createPackage = () => {
    const parent = require('../../package.json');
    const libPackage = Object.entries(parent)
        .filter(([key, value]) =>
            [
                'name',
                'version',
                'description',
                'keywords',
                'author',
                'license',
                'engines',
                'repository',
                'dependencies',
                'devDependencies',
            ].find(allowed => allowed === key),
        )
        .reduce(
            (libPackage, [key, value]) => {
                switch (key) {
                    case 'dependencies':
                    case 'devDependencies':
                        const libDeps = op.get(parent, 'libDependencies', []);
                        libPackage[key] = Object.entries(value)
                            .filter(([mod, version]) =>
                                libDeps.find(allowed => allowed === mod),
                            )
                            .reduce((deps, [mod, version]) => {
                                deps[mod] = version;
                                return deps;
                            }, {});
                        break;
                    default:
                        libPackage[key] = value;
                }
                return libPackage;
            },
            {
                main: 'lib.js',
            },
        );

    try {
        fs.ensureDirSync(
            path.normalize(`${rootPath}/${gulpConfig.dest.library}`),
        );

        fs.writeFileSync(
            path.normalize(
                `${rootPath}/${gulpConfig.dest.library}/package.json`,
            ),
            JSON.stringify(libPackage, null, 2),
        );
    } catch (error) {
        console.error('Error creating library package.json', error);
    }
};

module.exports = {
    createPackage,
};
