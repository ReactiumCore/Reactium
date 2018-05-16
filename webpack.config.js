'use strict';

const path                  = require('path');
const webpack               = require('webpack');
const UglifyJSPlugin        = require('uglifyjs-webpack-plugin');
const _                     = require('underscore');

module.exports = (gulpConfig, type = 'app') => {
    let config = gulpConfig;
    let plugins    = [];
    let tools      = '';
    let env        = config.env || 'production';
    let target     = 'web';
    let filename   = '[name].js';
    let entries    = ['babel-polyfill'];
        entries    = entries.concat(Object.values(config.entries));

    let dest      = config.dest.js;
    let externals = [];


    if (env === 'production') {
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
        mode: config.env,
        output:  {
            path: path.resolve(__dirname, dest),
            filename: filename,
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all"
                    }
                }
            },
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
