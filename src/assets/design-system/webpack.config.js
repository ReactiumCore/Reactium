'use strict';

const path              = require('path');
const webpack           = require('webpack');
const UglifyJSPlugin    = require('uglifyjs-webpack-plugin');

module.exports = (config) => {

    let plugins  = [];
    let devtools = '';

    if (!config.dev) {
        plugins.push(new UglifyJSPlugin());
    } else {
        devtools = 'source-map';
    }

    let env = (config.dev) ? 'development' : 'production';

    plugins.push(new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify(env)
        }
    }));

    try {
        require.resolve('jquery');
        plugins.push(new webpack.ProvidePlugin({
            'window.jQuery'    : 'jquery',
            'window.jquery'    : 'jquery',
            'window.$'         : 'jquery',
            'jQuery'           : 'jquery',
            'jquery'           : 'jquery',
            '$'                : 'jquery'
        }));
    } catch (e) {
        console.log('run npm install --save jquery');
    }


    return {
        target     : 'node',
        entry      : {
            'ar/scripts/ar'               : config.scripts.ar.src,
            'toolkit/scripts/toolkit'     : config.scripts.toolkit.src,
            'toolkit/scripts/catalyst'    : config.scripts.catalyst.src
        },
        output     :  {
            path        : path.resolve(__dirname, config.dest, 'assets'),
            filename    : '[name].js'
        },
        devtool    : devtools,
        plugins    : plugins,
        module:  {
            loaders: [
                {
                    test           : [/\.js$/, /\.es6$/, /\.jsx?S/],
                    loader         : 'babel-loader',
                    exclude        : /node_modules/,
                    query          : {
                        presets    : ['react', 'es2015']
                    }
                }
            ]
        }
    };
};
