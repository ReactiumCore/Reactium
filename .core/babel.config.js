const path = require('path');
const rootPath = path.resolve(__dirname, '..');
const semver = require('semver');
const op = require('object-path');
const babelCoreVersion = op.get(
    require(path.resolve(
        path.dirname(require.resolve('@babel/core')),
        '../package.json',
    )),
    'version',
);
const coreJsVersion = op.get(
    require(path.resolve(
        path.dirname(require.resolve('core-js')),
        'package.json',
    )),
    'version',
);

let corejs;
// annoying warning starts with @babel/core 7.4.0
if (semver.satisfies(semver.coerce(babelCoreVersion), '^7.4.0')) {
    if (semver.satisfies(semver.coerce(coreJsVersion), '>=2.0.0')) {
        corejs = '2';
    }
    if (semver.satisfies(semver.coerce(coreJsVersion), '>=3.0.0')) {
        corejs = '3';
    }
}

const alias = {
    manifest: './src/manifest',
    appdir: './src/app',
    components: './src/app/components',
    'reactium-core': './.core',
    reactium_modules: './reactium_modules',
    dependencies: './.core/dependencies',
    toolkit: './src/app/toolkit',
    'reactium-translations': './src/reactium-translations',
};

const env = {
    ...(corejs ? { corejs } : {}),
    useBuiltIns: 'usage',
    debug: false,
    targets: {
        browsers: ['> 1%', 'IE 11'],
    },
};

module.exports = {
    presets: ['@babel/react', ['@babel/env', env], '@babel/preset-flow'],
    plugins: [
        ['@babel/plugin-syntax-dynamic-import'],
        [
            'module-resolver',
            {
                cwd: rootPath,
                alias,
            },
        ],
        [
            '@babel/plugin-proposal-class-properties',
            {
                loose: true,
            },
        ],
        ['@babel/plugin-proposal-export-default-from'],
    ],
    env: {
        test: {
            presets: ['@babel/react', '@babel/env', '@babel/preset-flow'],
            plugins: [
                [
                    'module-resolver',
                    {
                        cwd: rootPath,
                        alias,
                    },
                ],
                [
                    '@babel/plugin-proposal-class-properties',
                    {
                        loose: true,
                    },
                ],
                ['@babel/plugin-syntax-dynamic-import'],
            ],
        },
        library: {
            presets: ['@babel/react', '@babel/env', '@babel/preset-flow'],
            plugins: [
                [
                    'module-resolver',
                    {
                        cwd: rootPath,
                        alias,
                    },
                ],
                [
                    '@babel/plugin-proposal-class-properties',
                    {
                        loose: true,
                    },
                ],
                ['@babel/plugin-syntax-dynamic-import'],
            ],
        },
    },
};
