'use strict';

const fs = require('fs');
const _ = require('underscore');
const path = require('path');
const globby = require('./globby-patch');
const webpack = require('webpack');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const env = process.env.NODE_ENV || 'development';
const rootPath = path.resolve(__dirname, '..');
const chalk = require('chalk');
const WebpackSDK = require('./webpack.sdk');

let defines = {};
if (fs.existsSync(`${rootPath}/src/app/server/defines.js`)) {
    defines = require(`${rootPath}/src/app/server/defines.js`);
}

const overrides = config => {
    globby
        .sync([
            './webpack.override.js',
            './node_modules/**/reactium-plugin/webpack.override.js',
            './src/**/webpack.override.js',
            './reactium_modules/**/webpack.override.js',
        ])
        .forEach(file => {
            try {
                require(path.resolve(file))(config);
            } catch (error) {
                console.error(chalk.red(`Error loading ${file}:`));
                console.error(error);
            }
        });
    return config;
};

module.exports = config => {
    const sdk = new WebpackSDK('reactium', 'reactium-webpack.js', config);

    let filename = '[name].js';
    let dest = config.dest.js;

    sdk.mode = env;
    sdk.entry = config.entries;
    sdk.target = 'web';
    sdk.output = {
        publicPath: '/assets/js/',
        path: path.resolve(__dirname, dest),
        filename,
    };
    sdk.devtool = env === 'development' ? 'source-map' : '';

    sdk.setCodeSplittingOptimize(env);
    if (process.env.DISABLE_CODE_SPLITTING === 'true') {
        sdk.setNoCodeSplitting();
    }

    Object.keys(defines).forEach(key => {
        if (key !== 'process.env') {
            config.defines[key] = JSON.stringify(defines[key]);
        }
    });

    config.defines['process.env'] = {
        NODE_ENV: JSON.stringify(env),
    };

    if ('process.env' in defines) {
        Object.keys(defines['process.env']).forEach(key => {
            config.defines['process.env'][key] = JSON.stringify(
                defines['process.env'][key],
            );
        });
    }

    sdk.addPlugin('defines', new webpack.DefinePlugin(config.defines));

    sdk.addContext('reactium-modules-context', {
        from: /reactium-translations$/,
        to: path.resolve('./src/reactium-translations'),
    });

    sdk.addPlugin(
        'suppress-critical-dep-warning',
        new FilterWarningsPlugin({
            exclude: /Critical dependency: the request of a dependency is an expression/i,
        }),
    );

    if (env === 'production') {
        sdk.addPlugin('asset-compression', new CompressionPlugin());
    }

    sdk.addRule('po-loader', {
        test: [/\.pot?$/],
        use: [
            {
                loader: '@atomic-reactor/webpack-po-loader',
            },
        ],
    });

    sdk.addRule('babel-loader', {
        test: [/\.jsx|js($|\?)/],
        exclude: [/node_modules/, /umd.js$/],
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
        },
        use: [
            {
                loader: 'babel-loader',
            },
        ],
    });

    sdk.addIgnore('umd', /umd.js$/);
    sdk.addIgnore('hbs', /\.hbs$/);
    sdk.addIgnore('css', /\.css$/);
    sdk.addIgnore('sass', /\.sass$/);
    sdk.addIgnore('scss', /\.scss$/);
    sdk.addIgnore('less', /\.less$/);
    sdk.addIgnore('backup', /\.BACKUP$/);
    sdk.addIgnore('png', /\.png$/);
    sdk.addIgnore('jpg', /\.jpg$/);
    sdk.addIgnore('gif', /\.gif$/);
    sdk.addIgnore('server-src', /\.core\/server/);
    sdk.addIgnore('manifest-tools', /\.core\/manifest/);
    sdk.addIgnore('core-index', /\.core\/index.js/);
    sdk.addIgnore('gulp', /\.core\/gulp/);
    sdk.addIgnore('reactium-config', /\.core\/reactium-config.js$/);
    sdk.addIgnore('webpack-sdk', /webpack.sdk/);
    sdk.addIgnore('core-configs', /\.core\/.*?\.config/);
    sdk.addIgnore('core-cli', /\.core\/.cli\//);
    sdk.addIgnore('project-cli', /\.cli/);
    sdk.addIgnore('server-app', /src\/app\/server/);
    sdk.addIgnore('arcli-install', /arcli-install.js$/);
    sdk.addIgnore('arcli-publish', /arcli-publish.js$/);
    sdk.addIgnore('reactium-boot', /reactium-boot.js$/);
    sdk.addIgnore('reactium-gulp', /reactium-gulp.js$/);
    sdk.addIgnore('reactium-webpack', /reactium-webpack.js$/);
    sdk.addIgnore('parse-node', /parse\/node/);

    if (env === 'production') {
        sdk.addIgnore('redux-devtools', /redux-devtools/);
    }

    return overrides(sdk.config());
};
