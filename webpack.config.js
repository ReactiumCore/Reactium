'use strict';

const path                  = require('path');
const webpack               = require('webpack');
const nodeExternals         = require('webpack-node-externals');
const UglifyJSPlugin        = require('uglifyjs-webpack-plugin');
const _                     = require('underscore');

module.exports = (gulpConfig, type = 'app') => {
    // shallow copy config and config.defines to prevent squashing server env
    let config = _.clone(gulpConfig);
    config.defines = _.clone(gulpConfig.defines);

    let plugins    = [];
    let tools      = '';
    let env        = config.env || 'production';
    let target     = (type === 'server') ? 'node' : 'web';
    let filename   = (type === 'server') ? 'index.js' : '[name].js';
    let entries    = ['babel-polyfill'];
        entries    = entries.concat(Object.values(config.entries));
        entries    = (type === 'server') ? './src/index.js' : entries;

    let dest      = (type === 'server') ? config.dest.server : config.dest.js;
    let externals = [];

    if (type === 'server' && env !== 'development') {
        externals.push(nodeExternals());
    };

    if (env !== 'development' || type === 'server' && false) {
        plugins.push(new UglifyJSPlugin());
    } else {
        tools = 'source-map';
    }

    // Only override process.env on client side
    if ( type === 'app' ) {
        config.defines['process.env'] = {
            NODE_ENV: JSON.stringify(env)
        };
    }
    plugins.push(new webpack.DefinePlugin(config.defines));

    return {
        target: target,
        entry: entries,
        devtool: tools,
        plugins: plugins,
        externals: externals,
        resolve: {
            alias: {
                appdir: config.src.appdir,
                rootdir: config.src.rootdir,
            }
        },
        output:  {
            path: path.resolve(__dirname, dest),
            filename: filename,
        },
        module:  {
            rules: [
                {
                    test: [/.js$/],
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                        }
                    ]
                }
            ]
        }
    };
};
