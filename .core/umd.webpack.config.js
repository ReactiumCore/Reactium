const fs = require('fs');
const path = require('path');
const globby = require('./globby-patch');
const op = require('object-path');
const rootPath = path.resolve(__dirname, '..');
const env = process.env.NODE_ENV || 'development';
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const WebpackSDK = require('./webpack.sdk');

const overrides = (umd, config) => {
    globby
        .sync([
            './umd.webpack.override.js',
            './node_modules/**/reactium-plugin/umd.webpack.override.js',
            './src/**/umd.webpack.override.js',
            './reactium_modules/**/umd.webpack.override.js',
        ])
        .forEach(file => {
            try {
                require(path.resolve(file))(umd, config);
            } catch (error) {
                console.error(chalk.red(`Error loading ${file}:`));
                console.error(error);
            }
        });
    return config;
};

module.exports = umd => {
    const sdk = new WebpackSDK(umd.libraryName, 'reactium-webpack.js', umd);

    const plugins = [];
    const presets = [];
    const rules = [];
    const defines = op.get(umd, 'staticDefines', {});

    if (op.get(umd, 'babelPresetEnv', true)) presets.push('@babel/preset-env');
    if (op.get(umd, 'babelReact', true)) presets.push('@babel/react');
    if (op.get(umd, 'babelLoader', true))
        sdk.addRule('babel-loader', {
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
        sdk.addExternal(key, { key, value });
    });

    if (op.get(umd, 'addDefines', true)) {
        sdk.addPlugin('defines', new webpack.DefinePlugin(defines));
    }

    sdk.mode = env;
    sdk.entry = umd.entry;
    sdk.output = {
        path: umd.outputPath,
        filename: umd.outputFile,
        library: umd.libraryName,
        libraryTarget: 'umd',
        globalObject: umd.globalObject,
    };

    if (env === 'production') {
        sdk.addPlugin('compression', new CompressionPlugin());
    } else if (op.get(umd, 'sourcemaps', true)) {
        sdk.devtool = 'cheap-source-map';
    }

    return overrides(umd, sdk.config());
};
