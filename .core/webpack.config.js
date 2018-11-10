'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const env = process.env.NODE_ENV || 'development';
const rootPath = path.resolve(__dirname, '..');

let defines = {};
if (fs.existsSync(`${rootPath}/src/app/server/defines.js`)) {
    defines = require(`${rootPath}/src/app/server/defines.js`);
}

module.exports = config => {
    let plugins = [];
    let externals = [];
    let target = 'web';
    let filename = '[name].js';
    let entries = config.entries;
    let dest = config.dest.js;
    let tools = env === 'development' ? 'source-map' : '';

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
                defines['process.env'][key]
            );
        });
    }

    plugins.push(new webpack.DefinePlugin(config.defines));
    plugins.push(
        new webpack.ContextReplacementPlugin(/^toolkit/, context => {
            context.request = path.resolve('./src/app/toolkit');
        })
    );
    plugins.push(
        new webpack.ContextReplacementPlugin(
            /^components\/common-ui/,
            context => {
                context.request = path.resolve(
                    './src/app/components/common-ui'
                );
            }
        )
    );
    plugins.push(
        new webpack.ContextReplacementPlugin(/^components/, context => {
            context.request = path.resolve('./src/app/components');
        })
    );
    plugins.push(
        new webpack.ContextReplacementPlugin(
            /^reactium-core\/components/,
            context => {
                context.request = path.resolve('./.core/components');
            }
        )
    );
    plugins.push(
        new FilterWarningsPlugin({
            exclude: /Critical dependency: the request of a dependency is an expression/i,
        })
    );

    const defaultConfig = {
        target: target,
        entry: entries,
        devtool: tools,
        plugins: plugins,
        externals: externals,
        mode: env,
        output: {
            path: path.resolve(__dirname, dest),
            filename,
        },
        optimization: {
            minimize: Boolean(env !== 'development'),
            splitChunks: {
                chunks: 'all',
                name(module) {
                    if (/[\\/]node_modules[\\/]/.test(module.context)) {
                        return 'vendors';
                    }
                    return 'main';
                },
            },
        },
        module: {
            rules: [
                {
                    test: [/\.jsx|js($|\?)/],
                    exclude: [/node_modules/],
                    resolve: {
                        extensions: ['.js', '.jsx', '.json'],
                    },
                    use: [
                        {
                            loader: 'babel-loader',
                        },
                    ],
                },
                {
                    test: [
                        /.hbs$/,
                        /.css$/,
                        /.sass$/,
                        /.scss$/,
                        /.less$/,
                        /.BACKUP$/,
                        /.png$/,
                        /.jpg$/,
                        /.gif$/,
                        /\.core\/.cli\//,
                        /\.cli/,
                    ],
                    use: [
                        {
                            loader: 'ignore-loader',
                        },
                    ],
                },
            ],
        },
    };

    let webPackOverride = _ => _;
    if (fs.existsSync(`${rootPath}/webpack.override.js`)) {
        webPackOverride = require(`${rootPath}/webpack.override.js`);
    }

    return webPackOverride(defaultConfig);
};
