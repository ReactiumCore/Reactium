const fs = require('fs');
const path = require('path');
const rootPath = path.resolve(__dirname, '..');
const gulpConfig = require('./gulp.config');

const contextMode = () => {
    if (
        process.env.NODE_ENV !== 'development' &&
        process.env.LAZY_GET_COMPONENTS !== 'off'
    ) {
        return 'lazy-once';
    }

    return 'sync';
};

const defaultLibraryExternals = {
    Reactium: {
        externalName: '/sdk$/',
        // relative to src/manifest.js
        requirePath: 'reactium-core/sdk',
        // to provide both es6 named exports and Reactium default alias
        defaultAlias: 'Reactium',
    },
    react: {
        externalName: 'react',
        requirePath: 'react',
        // to provide both es6 named exports and React default alias
        defaultAlias: 'React',
    },
    redux: {
        externalName: 'redux',
        requirePath: 'redux',
    },
    'gsap/umd/TweenMax': {
        externalName: '/^gsap.*$/',
        requirePath: 'gsap/umd/TweenMax',
    },
    'reactium-core/easy-connect': {
        externalName: '/easy-connect$/',
        // relative to src/manifest.js
        requirePath: 'reactium-core/easy-connect',
    },
    underscore: {
        externalName: 'underscore',
        requirePath: 'underscore',
    },
    'object-path': {
        externalName: 'object-path',
        requirePath: 'object-path',
    },
    semver: {
        externalName: 'semver',
        requirePath: 'semver',
    },
    moment: {
        externalName: 'moment',
        requirePath: 'moment',
    },
    classnames: {
        externalName: 'classnames',
        requirePath: 'classnames',
    },
    'prop-types': {
        externalName: 'prop-types',
        requirePath: 'prop-types',
    },
    'react-router-dom': {
        externalName: 'react-router-dom',
        requirePath: 'react-router-dom',
    },
    'redux-super-thunk': {
        externalName: 'redux-super-thunk',
        requirePath: 'redux-super-thunk',
    },
};

const defaultManifestConfig = {
    patterns: [
        {
            name: 'allActions',
            type: 'actions',
            pattern: /actions.jsx?$/,
            ignore: /\.cli/,
        },
        {
            name: 'allActionTypes',
            type: 'actionTypes',
            pattern: /actionTypes.jsx?$/,
        },
        {
            name: 'allReducers',
            type: 'reducers',
            pattern: /reducers.jsx?$/,
        },
        {
            name: 'allInitialStates',
            type: 'state',
            pattern: /state.jsx?$/,
        },
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
            name: 'allMiddleware',
            type: 'middleware',
            pattern: /middleware.jsx?$/,
            ignore: /server\/middleware/,
        },
        {
            name: 'allEnhancers',
            type: 'enhancer',
            pattern: /enhancer.jsx?$/,
        },
        {
            name: 'allPlugins',
            type: 'plugin',
            pattern: /plugin.jsx?$/,
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
            to: '',
        },
        {
            from: '.core/',
            to: 'reactium-core/',
        },
    ],
    pluginExternals: defaultLibraryExternals,
    contexts: {
        components: {
            modulePath: 'components',
            filePattern: '.js?$',
            mode: contextMode(),
        },
        common: {
            modulePath: 'components/common-ui/',
            filePattern: '.js?$',
            mode: contextMode(),
        },
        toolkit: {
            modulePath: 'toolkit',
            filePattern: '.js?$',
            mode: contextMode(),
        },
        core: {
            modulePath: 'reactium-core/components',
            filePattern: '.js?$',
            mode: contextMode(),
        },
    },
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
            },
        ],
        sourceMappings: [
            {
                from: 'src/',
                to: path.resolve(rootPath, 'src') + '/',
            },
        ],
        searchParams: {
            extensions: /\.(js|json)$/,
            exclude: [
                /.ds_store/i,
                /.core/i,
                /.cli\//i,
                /src\/assets/,
                /src\/app\/toolkit/,
            ],
        },
    },
};

let manifestConfigOverride = _ => _;
if (fs.existsSync(`${rootPath}/manifest.config.override.js`)) {
    manifestConfigOverride = require(`${rootPath}/manifest.config.override.js`);
}
const manifestConfig = manifestConfigOverride(defaultManifestConfig);

/**
 * Use liberally for additional core configuration.
 * @type {Object}
 */
module.exports = {
    version: '3.1.6',
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
                    static: 'npm-run-all build:* && gulp static',
                    local: 'gulp local',
                    'local:ssr': 'gulp local:ssr',
                },
                remove: [
                    'build:cleanup',
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
                    overwrite: false,
                    version: '>=2.3.16',
                    destination:
                        '/src/app/components/common-ui/Icon/defaultProps.js',
                    source:
                        '/tmp/update/src/app/components/common-ui/Icon/defaultProps.js',
                },
                {
                    overwrite: false,
                    version: '>=2.3.16',
                    destination: '/src/app/components/common-ui/Icon/index.js',
                    source:
                        '/tmp/update/src/app/components/common-ui/Icon/index.js',
                },
                {
                    overwrite: true,
                    version: '>=2.3.16',
                    destination: '/src/app/components/common-ui/Icon/Feather',
                    source:
                        '/tmp/update/src/app/components/common-ui/Icon/Feather',
                },
                {
                    overwrite: true,
                    version: '>=2.3.16',
                    destination: '/src/app/toolkit/icons/Feather',
                    source: '/tmp/update/src/app/toolkit/icons/Feather',
                },
                {
                    overwrite: true,
                    version: '>=3.0.2',
                    destination: '/.eslintrc',
                    source: '/tmp/update/.eslintrc',
                },
                {
                    overwrite: false,
                    version: '>=3.0.3',
                    destination: '/src/app/components/Fallback',
                    source: '/tmp/update/src/app/components/Fallback',
                },
                {
                    overwrite: false,
                    version: '>=3.0.19',
                    destination: '/jest.config.js',
                    source: '/tmp/update/jest.config.js',
                },
            ],
            remove: [],
        },
    },
    manifest: manifestConfig,
};
