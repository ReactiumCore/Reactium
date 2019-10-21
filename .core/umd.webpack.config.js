const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const rootPath = path.resolve(__dirname, '..');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = umd => {
    const plugins = [];
    if (env === 'production') {
        plugins.push(new CompressionPlugin());
    }

    const config = {
        mode: env,
        entry: umd.entry,
        devtool: 'inline-source-map',
        output: {
            path: umd.outputPath,
            filename: umd.outputFile,
            library: umd.libraryName,
            libraryTarget: 'umd',
            globalObject: umd.globalObject,
        },
        module: {
            rules: [
                {
                    test: /(\.jsx|\.js)$/,
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/react'],
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
                },
            ],
        },
        externals: Object.entries(umd.externals).reduce(
            (externals, [key, value]) => {
                // regex key
                if (/^\/.*\/i?$/.test(key)) {
                    const args = [key.replace(/^\//, '').replace(/\/i?$/, '')];
                    if (/i$/.test(key)) args.push('i');
                    externals.push(new RegExp(...args));
                    return externals;
                }
                externals.push(value);
                return externals;
            },
            [],
        ),
        plugins,
    };

    let override = (umd, config) => config;
    if (fs.existsSync(`${rootPath}/umd.webpack.override.js`)) {
        override = require(`${rootPath}/umd.webpack.override.js`);
    }

    return override(umd, config);
};
