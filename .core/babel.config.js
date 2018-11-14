const path = require('path');
const rootPath = path.resolve(__dirname, '..');

module.exports = {
    presets: [
        '@babel/react',
        [
            '@babel/env',
            {
                useBuiltIns: 'usage',
                debug: false,
                targets: {
                    browsers: ['> 1%', 'IE 11'],
                },
            },
        ],
    ],
    plugins: [
        [
            'module-resolver',
            {
                cwd: rootPath,
                alias: {
                    manifest: './src/manifest',
                    appdir: './src/app',
                    components: './src/app/components',
                    'reactium-core': './.core',
                    dependencies: './.core/dependencies',
                    toolkit: './src/app/toolkit',
                },
            },
        ],
        [
            '@babel/plugin-proposal-class-properties',
            {
                loose: true,
            },
        ],
    ],
};
