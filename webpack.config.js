'use strict';

const path    = require('path');
const webpack = require('webpack');
const env     = process.env.NODE_ENV || 'development';

module.exports = (gulpConfig, type = 'app') => {
    let plugins   = [];
    let externals = [];
    let target    = 'web';
    let config    = gulpConfig;
    let filename  = '[name].js';
    let entries   = config.entries;
    let dest      = config.dest.js;
    let tools     = (env === 'development') ? 'source-map' : '';

    // Only override process.env on client side
    if ( type === 'app' ) {
        config.defines['process.env'] = {
            NODE_ENV: JSON.stringify(env)
        };
    }
    plugins.push(new webpack.DefinePlugin(config.defines));
    plugins.push(new webpack.ContextReplacementPlugin(/^toolkit/, context => {
        context.request = path.resolve('./src/app/toolkit');
    }));
    plugins.push(new webpack.ContextReplacementPlugin(/^components/, context => {
        context.request = path.resolve('./src/app/components');
    }));
    plugins.push(new webpack.ContextReplacementPlugin(/^reactium-core\/components/, context => {
        context.request = path.resolve('./.core/components');
    }));

    return {
        target    : target,
        entry     : entries,
        devtool   : tools,
        plugins   : plugins,
        externals : externals,
        mode      : env,
        output    :  {
            path: path.resolve(__dirname, dest),
            filename,
        },
        optimization: {
            minimize: Boolean(env !== 'development'),
            splitChunks: {
                cacheGroups : Object.assign({
                    vendors : {
                        test   : /[\\/]node_modules[\\/]/,
                        name   : "vendors",
                        chunks : "all",
                    },
                }),
            },
        },
        module:  {
            rules: [
                {
                    test    : [/.js$/],
                    exclude : /node_modules/,
                    use     : [
                        {
                            loader: 'babel-loader',
                        }
                    ]
                },
                {
                    test : [/.css$/, /.sass$/, /.scss$/, /.less$/, /.BACKUP$/,],
                    use  : [
                        {
                            loader: 'ignore-loader',
                        }
                    ]
                }
            ]
        }
    };
};
