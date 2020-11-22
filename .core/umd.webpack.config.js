const fs = require('fs');
const path = require('path');
const globby = require('globby');
const op = require('object-path');
const rootPath = path.resolve(__dirname, '..');
const env = process.env.NODE_ENV || 'development';
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');

const overrides = (umd, config) => {
    globby
        .sync([
            './umd.webpack.override.js',
            './node_modules/**/reactium-plugin/umd.webpack.override.js',
            './src/**/umd.webpack.override.js',
            './reactium_modules/**/umd.webpack.override.js',
        ])
        .forEach(file => require(path.resolve(file))(umd, config));
    return config;
};

module.exports = umd => {
    const plugins = [];
    const presets = [];
    const rules = [];
    const defines = op.get(umd, 'staticDefines', {});

    if (op.get(umd, 'babelPresetEnv', true)) presets.push('@babel/preset-env');
    if (op.get(umd, 'babelReact', true)) presets.push('@babel/react');
    if (op.get(umd, 'babelLoader', true))
        rules.push({
            test: /(\.jsx|\.js)$/,
            loader: 'babel-loader',
            options: {
                presets,
                plugins: [
                    [
                        '@babel/plugin-proposal-class-properties',
                        {
                            loose: true,
                        },
                    ],
                    ['module-resolver'],
                ],
            },
        });

    if (op.get(umd, 'workerRestAPI', true)) {
        op.set(
            defines,
            'workerRestAPIConfig',
            JSON.stringify({
                actiniumAppId: process.env.ACTINIUM_APP_ID || 'Actinium',
                restAPI: process.env.WORKER_REST_API_URL || '/api',
            }),
        );
    }

    const externals = [];
    Object.entries(umd.externals).forEach(([key, value]) => {
        // regex key
        if (/^\/.*\/i?$/.test(key)) {
            const args = [key.replace(/^\//, '').replace(/\/i?$/, '')];
            if (/i$/.test(key)) args.push('i');
            externals.push(new RegExp(...args));
            return externals;
        }
        externals.push(value);
    });

    if (op.get(umd, 'addDefines', true)) {
        plugins.push(new webpack.DefinePlugin(defines));
    }

    const config = {
        mode: env,
        entry: umd.entry,
        output: {
            path: umd.outputPath,
            filename: umd.outputFile,
            library: umd.libraryName,
            libraryTarget: 'umd',
            globalObject: umd.globalObject,
        },
        module: {
            rules,
        },
        externals,
        plugins,
    };

    if (env === 'production') {
        plugins.push(new CompressionPlugin());
    } else if (op.get(umd, 'sourcemaps', true)) {
        config.devtool = 'cheap-source-map';
    }

    return overrides(umd, config);
};
