const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const rootPath = path.resolve(__dirname, '..');

module.exports = umd => {
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
                },
            ],
        },
        externals: umd.externals,
    };

    let override = (umd, config) => config;
    if (fs.existsSync(`${rootPath}/umd.webpack.override.js`)) {
        override = require(`${rootPath}/umd.webpack.override.js`);
    }

    return override(umd, config);
};
