const fs = require('fs');
const path = require('path');
const globby = require('./globby-patch');
const rootPath = path.resolve(__dirname, '..');
const gulpConfig = require('./gulp.config');

const version = '4.1.6';

const defaultLibraryExternals = {
    axios: {
        externalName: 'axios',
        requirePath: 'axios',
    },
    classnames: {
        externalName: 'classnames',
        requirePath: 'classnames',
    },
    'copy-to-clipboard': {
        externalName: 'copy-to-clipboard',
        requirePath: 'copy-to-clipboard',
    },

    moment: {
        externalName: 'moment',
        requirePath: 'dayjs',
    },

    dayjs: {
        externalName: 'dayjs',
        requirePath: 'dayjs',
    },

    'object-path': {
        externalName: 'object-path',
        requirePath: 'object-path',
    },
    'prop-types': {
        externalName: 'prop-types',
        requirePath: 'prop-types',
    },
    react: {
        externalName: 'react',
        requirePath: 'react',
        // to provide both es6 named exports and React default alias
        defaultAlias: 'React',
    },
    'react-router-dom': {
        externalName: 'react-router-dom',
        requirePath: 'react-router-dom',
    },
    ReactDOM: {
        externalName: 'react-dom',
        requirePath: 'react-dom',
        // to provide both es6 named exports and React default alias
        defaultAlias: 'ReactDOM',
    },
    Reactium: {
        externalName: '/reactium-core/sdk$/',
        // relative to src/manifest.js
        requirePath: 'reactium-core/sdk',
        // to provide both es6 named exports and Reactium default alias
        defaultAlias: 'Reactium',
    },
    semver: {
        externalName: 'semver',
        requirePath: 'semver',
    },
    'shallow-equals': {
        externalName: 'shallow-equals',
        requirePath: 'shallow-equals',
    },
    underscore: {
        externalName: 'underscore',
        requirePath: 'underscore',
    },
    uuid: {
        externalName: 'uuid',
        requirePath: 'uuid',
    },
    xss: {
        externalName: 'xss',
        requirePath: 'xss',
    },
};

const defaultManifestConfig = {
    patterns: [
        {
            name: 'allRoutes',
            type: 'route',
            pattern: /route.jsx?$/,
        },
        {
            name: 'allServices',
            type: 'services',
            pattern: /services.jsx?$/,
        },
        {
            name: 'allPlugins',
            type: 'plugin',
            pattern: /(plugin|zone).jsx?$/,
        },
        {
            name: 'allHooks',
            type: 'hooks',
            pattern: /reactium-hooks.js$/,
        },
    ],
    sourceMappings: [
        {
            from: 'src/app/',
            to: '../src/app/',
        },
        {
            from: '.core/',
            to: 'reactium-core/',
        },
        {
            from: 'reactium_modules/',
            to: '../reactium_modules/',
        },
        {
            node_modules: true,
            ignore: /^((?!reactium-plugin).)*$/,
        },
    ],
    pluginExternals: defaultLibraryExternals,
    umd: {
        defaultLibraryExternals,
        patterns: [
            {
                name: 'allUmdEntries',
                type: 'umd',
                pattern: /umd.js$/,
                ignore: /assets/,
            },
            {
                name: 'allUmdConfig',
                type: 'config',
                pattern: /umd-config.json$/,
                ignore: /assets/,
                stripExtension: false,
            },
        ],
        sourceMappings: [
            {
                from: 'src/',
                to: path.resolve(rootPath, 'src') + '/',
            },
            {
                from: 'reactium_modules/',
                to: path.resolve(rootPath, 'reactium_modules') + '/',
            },
        ],
        searchParams: {
            extensions: /\.(js|json)$/,
            exclude: [/\.ds_store/i, /\.core/i, /\.cli\//i, /src\/assets/],
        },
    },
};

const overrides = config => {
    globby
        .sync([
            './manifest.config.override.js',
            './node_modules/**/reactium-plugin/manifest.config.override.js',
            './src/**/manifest.config.override.js',
            './reactium_modules/**/manifest.config.override.js',
        ])
        .forEach(file => require(path.resolve(file))(config));
    return config;
};

const manifestConfig = overrides(defaultManifestConfig);

/**
 * Use liberally for additional core configuration.
 * @type {Object}
 */
module.exports = {
    version,
    semver: '^3.0.0',
    build: gulpConfig,
    update: {
        package: {
            dependencies: {
                remove: [
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/polyfill',
                    'ajv',
                    'beautify',
                    'express-http-proxy',
                    'htmltojsx',
                    'js-beautify',
                ],
            },
            devDependencies: {
                remove: [
                    '@atomic-reactor/cli',
                    'atomic-reactor-cli',
                    'babel-cli',
                    'babel-core',
                    'babel-preset-env',
                    'babel-preset-react',
                    'babel-preset-stage-2',
                    'gulp-install',
                    'gulp-csso',
                    'nodemon',
                    'run-sequence',
                    'vinyl-source-stream',
                    'webpack-visualizer-plugin',
                ],
            },
            scripts: {
                add: {
                    build: 'npm-run-all build:*',
                    'build:gulp': 'cross-env NODE_ENV=production gulp',
                    'build:babel-core':
                        'cross-env NODE_ENV=production babel .core --out-dir build/.core',
                    'build:babel-reactium_modules':
                        'cross-env NODE_ENV=production babel reactium_modules --out-dir build/reactium_modules',
                    'build:babel-src':
                        'cross-env NODE_ENV=production babel src --out-dir build/src',
                    static: 'npm-run-all build:* && gulp static',
                    local: 'gulp local',
                    'local:ssr': 'gulp local:ssr',
                },
                remove: [
                    'build',
                    'build:gulp',
                    'build:babel-core',
                    'build:babel-reactium_modules',
                    'build:babel-src',
                    'local-fe-start',
                    'local-fe:gulp',
                    'local-fe:babel-node',
                    'local-ssr-start',
                    'local-ssr:gulp',
                    'local-ssr:babel-node',
                    'react-redux',
                    'static:build',
                ],
            },
            husky: {
                remove: ['hooks'],
            },
        },
        files: {
            add: [
                {
                    overwrite: true,
                    version: '>=3.1.0',
                    destination: '/apidoc.json',
                    source: '/tmp/update/apidoc.json',
                },
                {
                    overwrite: true,
                    version: '>=3.0.0',
                    destination: '/Dockerfile',
                    source: '/tmp/update/Dockerfile',
                },
                {
                    overwrite: true,
                    version: '>=2.3.16',
                    destination: '/src/app/plugable/index.js',
                    source: '/tmp/update/src/app/plugable/index.js',
                },
                {
                    overwrite: false,
                    version: '>=2.3.16',
                    destination: '.stylelintrc',
                    source: '/tmp/update/.stylelintrc',
                },
                {
                    overwrite: true,
                    version: '>=3.0.2',
                    destination: '/.eslintrc',
                    source: '/tmp/update/.eslintrc',
                },
                {
                    overwrite: false,
                    version: '>=3.0.19',
                    destination: '/jest.config.js',
                    source: '/tmp/update/jest.config.js',
                },
                {
                    overwrite: false,
                    version: '>=3.1.0',
                    destination: '/.gettext.json',
                    source: '/tmp/update/.gettext.json',
                },
                {
                    overwrite: false,
                    version: '>=3.1.0',
                    destination: '/src/reactium-translations',
                    source: '/tmp/update/src/reactium-translations',
                },
                {
                    overwrite: false,
                    version: '>=3.2.1',
                    destination: '/.flowconfig',
                    source: '/tmp/update/.flowconfig',
                },
                {
                    overwrite: false,
                    version: '>=3.2.2',
                    destination: '/.huskyrc',
                    source: '/tmp/update/.huskyrc',
                },
                {
                    overwrite: false,
                    version: '>=3.4.2',
                    destination: '/src/app/api/reactium-hooks.js',
                    source: '/tmp/update/src/app/api/reactium-hooks.js',
                },
                {
                    overwrite: false,
                    version: '>=3.4.2',
                    destination: '/src/app/api/index.js',
                    source: '/tmp/update/src/app/api/index.js',
                },
                {
                    overwrite: false,
                    version: '>=3.4.2',
                    destination: '/src/app/api/domain.js',
                    source: '/tmp/update/src/app/api/domain.js',
                },
                {
                    overwrite: false,
                    version: '>=3.4.2',
                    destination: '/.npmrc',
                    source: '/tmp/update/.npmrc',
                },
                {
                    overwrite: true,
                    version: '>=3.5.1',
                    destination: '/src/sw',
                    source: '/tmp/update/src/sw',
                },
                {
                    overwrite: true,
                    version: '>=3.5.1',
                    destination: '/src/app/main.js',
                    source: '/tmp/update/src/app/main.js',
                },
                {
                    overwrite: true,
                    version: '>=3.6.0',
                    destination: '/.dockerignore',
                    source: '/tmp/update/.dockerignore',
                },
            ],
            remove: [],
        },
    },
    manifest: manifestConfig,
};
