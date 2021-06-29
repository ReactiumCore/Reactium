const tree = require('directory-tree');
const path = require('path');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const prettier = require('prettier');
const moment = require('moment');
const chalk = require('chalk');
const diff = require('fast-diff');
const hb = require('handlebars');

const flattenRegistry = (registry = { children: [] }, manifest = []) => {
    op.get(registry, 'children', []).forEach(item => {
        const type = op.get(item, 'type');
        if (type === 'directory') {
            const children = op.get(item, 'children', []);
            if (children.length > 0) {
                return flattenRegistry(item, manifest);
            }

            return manifest;
        }

        if ('path' in item) {
            manifest.push(item);
        }
    });

    return manifest;
};

const sources = (sourcePath, searchParams) =>
    flattenRegistry(tree(sourcePath, searchParams));

const isRegExp = regEx =>
    typeof regEx === 'object' && regEx.constructor == RegExp;

const find = (searches = [], sourceMappings = [], searchParams = {}) => {
    let mappings = {};
    searches.forEach(({ name, type }) => {
        mappings[name] = {
            type,
            imports: [],
            originals: {},
        };
    });

    sourceMappings.forEach(sourceMapping => {
        const nodeModules = Boolean(op.get(sourceMapping, 'node_modules'));
        const params = {
            ...searchParams,
            exclude: [...(op.get(searchParams, 'exclude', []) || [])],
        };

        const exclude = op
            .get(params, 'exclude', [])
            .concat(op.get(sourceMapping, 'exclude', []));

        op.set(params, 'exclude', exclude);

        const files = [];
        if (nodeModules) {
            // exclude deep packages
            exclude.push(/node_modules$/);

            const packagePath = module.paths
                .map(p => path.resolve(path.dirname(p), 'package.json'))
                .find(packagePath => fs.existsSync(packagePath));

            let modules = Object.keys(
                op.get(require(packagePath), 'dependencies', {}),
            );

            const reactiumModules = Object.keys(
                op.get(require(packagePath), 'reactiumDependencies', {}),
            );

            // Special exception for reactium_modules dependencies, which will be considered
            if (reactiumModules.length) {
                const reactiumModuleDir = path.resolve(
                    path.dirname(packagePath),
                    'reactium_modules',
                );
                reactiumModules.forEach(reactiumModule => {
                    const subPackage = path.resolve(
                        reactiumModuleDir,
                        reactiumModule,
                        '_npm/package.json',
                    );
                    if (fs.existsSync(subPackage)) {
                        modules = _.uniq(
                            modules.concat(
                                Object.keys(
                                    op.get(
                                        require(subPackage),
                                        'dependencies',
                                        {},
                                    ),
                                ),
                            ),
                        );
                    }
                });
            }

            modules.forEach(mod => {
                let from;
                try {
                    from = path.dirname(require.resolve(mod));
                } catch (err) {}

                if (from) {
                    sources(from, params).forEach(file => {
                        file.mod = mod;
                        files.push(file);
                    });
                }
            });
        } else if (op.has(sourceMapping, 'from')) {
            sources(sourceMapping.from, params).forEach(file =>
                files.push(file),
            );
        }

        files.forEach(fileObj => {
            const file = fileObj.path;

            // ignore entire set of source paths if ignore specified
            if (
                op.has(sourceMapping, 'ignore') &&
                isRegExp(sourceMapping.ignore) &&
                sourceMapping.ignore.test(file)
            )
                return;

            searches.forEach(search => {
                const { name, pattern, ignore } = search;
                if (ignore && isRegExp(ignore) && ignore.test(file)) return;

                if (pattern.test(file)) {
                    let normalized = file;
                    if (nodeModules) {
                        normalized = normalized.replace(
                            new RegExp(`.*${fileObj.mod}`),
                            fileObj.mod,
                        );
                    }

                    normalized = normalized.replace(/\\/g, '/');
                    if (op.has(sourceMapping, 'from')) {
                        normalized = normalized.replace(
                            sourceMapping.from,
                            op.get(sourceMapping, 'to', sourceMapping.from),
                        );
                    }

                    if (op.get(search, 'stripExtension', true)) {
                        normalized = normalized.replace(fileObj.extension, '');
                    }

                    mappings[name].originals[normalized] = file;
                    mappings[name].imports.push(normalized);
                }
            });
        });
    });

    return mappings;
};

module.exports = function({
    manifestFilePath,
    manifestConfig,
    manifestTemplateFilePath,
    manifestProcessor,
}) {
    const patterns = op.get(manifestConfig, 'patterns', []);
    const sourceMappings = op.get(manifestConfig, 'sourceMappings', []);
    const searchParams = op.get(manifestConfig, 'searchParams', {
        extensions: /\.jsx?$/,
        exclude: [/.ds_store/i, /.core\/.cli\//i, /.cli\//i],
    });

    const manifest = find(patterns, sourceMappings, searchParams);

    const template = hb.compile(
        fs.readFileSync(manifestTemplateFilePath, 'utf-8'),
    );

    let fileContents = template(
        manifestProcessor({
            manifest,
            manifestConfig,
        }),
    );

    if (/.jsx?$/.test(manifestFilePath)) {
        fileContents = prettier.format(fileContents, {
            parser: 'babel',
            trailingComma: 'all',
            singleQuote: true,
            tabWidth: 4,
            useTabs: false,
        });
    }

    const manifestHasChanged = () => {
        const prevFileContents = fs.readFileSync(manifestFilePath, 'utf-8');
        const changes = diff(prevFileContents, fileContents).filter(
            ([code, change]) => code !== 0,
        );
        return changes.length > 0;
    };

    // Write Manifest only if it does not exist or has changed
    if (!fs.existsSync(manifestFilePath) || manifestHasChanged()) {
        console.log(`'${chalk.cyan(manifestFilePath)}'...`);
        const dir = path.dirname(manifestFilePath);
        fs.ensureDirSync(dir);
        fs.writeFileSync(manifestFilePath, fileContents);
    }
};
