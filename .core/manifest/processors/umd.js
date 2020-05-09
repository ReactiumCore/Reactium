const path = require('path');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const config = require('../../gulp.config');

module.exports = data => {
    const umdConfigs = op
        .get(data, 'manifest.allUmdConfig.imports', [])
        .reduce((configs, configPath) => {
            const dir = path.dirname(path.normalize(configPath));
            let config = {};
            try {
                config = JSON.parse(
                    fs.readFileSync(path.normalize(configPath), 'utf8'),
                );
            } catch (err) {}

            configs[dir] = config;

            return configs;
        }, {});

    const defaultLibraryExternals = Object.values(
        op.get(data, 'manifestConfig.defaultLibraryExternals', {}),
    ).reduce((externals, { externalName }) => {
        externals[externalName] = externalName;
        return externals;
    }, {});

    return JSON.stringify(
        op.get(data, 'manifest.allUmdEntries.imports', []).map(entryPath => {
            const dir = path.dirname(entryPath);
            const umdConfig = op.get(umdConfigs, dir, {});
            const libraryName = op.get(
                umdConfig,
                'libraryName',
                path.basename(dir),
            );
            const outputBase = op.get(config, 'umd.outputPath');
            const outputPath = path.resolve(
                outputBase,
                op.get(umdConfig, 'outputPath', libraryName),
            );
            const outputFile = op.get(
                umdConfig,
                'outputFile',
                `${libraryName}.js`,
            );
            const externals = op.get(
                umdConfig,
                'externals',
                defaultLibraryExternals,
            );
            const globalObject = op.get(umdConfig, 'globalObject', 'window');
            const babelPresetEnv = op.get(umdConfig, 'babelPresetEnv', true);
            const babelReact = op.get(umdConfig, 'babelReact', true);
            const babelLoader = op.get(umdConfig, 'babelLoader', true);

            return {
                ...umdConfig,
                entry: path.normalize(entryPath + '.js'),
                libraryName,
                outputPath,
                outputFile,
                externals,
                globalObject,
                babelPresetEnv,
                babelReact,
                babelLoader,
            };
        }),
        null,
        2,
    );
};
