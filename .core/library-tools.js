const fs = require('fs');
const path = require('path');
const op = require('object-path');
const hb = require('handlebars');
const gulpConfig = require('./gulp.config');
const rootPath = path.resolve(__dirname, '..');

const parseDomains = (imports = []) =>
    imports
        .map(file => file.replace(/\\/g, '/'))
        .map(file => {
            const domainRegExp = new RegExp(`\/([A-Za-z_0-9]+?)\/library$`);
            let [, domain] = file.match(domainRegExp);

            return {
                domain,
                file,
            };
        });

const createLibExports = () => {
    try {
        const template = hb.compile(
            fs.readFileSync(
                path.resolve(__dirname, 'libraries/libs-template.hbs'),
                'utf-8',
            ),
        );
        const { imports } = op.get(
            require(gulpConfig.src.library).list(),
            'allLibraryComponents',
            { imports: [] },
        );

        if (!fs.existsSync(`${rootPath}/${gulpConfig.dest.library}`)) {
            fs.mkdirSync(`${rootPath}/${gulpConfig.dest.library}`);
        }
        fs.writeFileSync(
            `${rootPath}/${gulpConfig.dest.library}/index.js`,
            template(parseDomains(imports)),
        );
    } catch (error) {
        console.error(`Error reading library manifest.`, error);
    }
};

const createPackage = () => {
    const parent = require('../package.json');
    const package = Object.entries(parent)
        .filter(([key, value]) =>
            [
                'name',
                'version',
                'description',
                'main',
                'scripts',
                'keywords',
                'author',
                'license',
                'engines',
                'repository',
                'browser',
                'dependencies',
                'devDependencies',
            ].find(allowed => allowed === key),
        )
        .reduce(
            (package, [key, value]) => {
                switch (key) {
                    case 'dependencies':
                    case 'devDependencies':
                        const libDeps = op.get(parent, 'libDependencies', []);
                        package[key] = Object.entries(value)
                            .filter(([mod, version]) =>
                                libDeps.find(allowed => allowed === mod),
                            )
                            .reduce((deps, [mod, version]) => {
                                deps[mod] = version;
                                return deps;
                            }, {});
                        break;
                    default:
                        package[key] = value;
                }
                return package;
            },
            {
                main: 'index.js',
            },
        );

    try {
        if (!fs.existsSync(`${rootPath}/${gulpConfig.dest.library}`)) {
            fs.mkdirSync(`${rootPath}/${gulpConfig.dest.library}`);
        }
        fs.writeFileSync(
            `${rootPath}/${gulpConfig.dest.library}/package.json`,
            JSON.stringify(package, null, 2),
        );
    } catch (error) {
        console.error('Error creating library package.json', error);
    }
};

module.exports = {
    createLibExports,
    createPackage,
};
