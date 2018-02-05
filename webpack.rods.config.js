'use strict';

const path                  = require('path');
const webpack               = require('webpack');
const nodeExternals         = require('webpack-node-externals');
const UglifyJSPlugin        = require('uglifyjs-webpack-plugin');
const VirtualModulePlugin   = require('virtual-module-webpack-plugin');
const reduxExports           = require('./redux.exports');
const rodsExports           = require('./rods.exports');

module.exports = config => {
    const webpackConfig = require('./webpack.config')(config, 'server');

    webpackConfig.plugins.push(
        new VirtualModulePlugin({
            moduleName: 'src/app/rods-exports.js',
            contents: rodsExports,
        })
    );

    webpackConfig.entry = ['./src/rods.js'];
    webpackConfig.output.filename = 'rods.js';
    webpackConfig.output.libraryTarget = 'commonjs';

    return webpackConfig
};
