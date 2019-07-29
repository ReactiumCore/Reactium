const contextMode = () => {
    if (
        process.env.NODE_ENV !== 'development' ||
        process.env.LAZY_GET_COMPONENTS === 'on'
    ) {
        return 'lazy-once';
    }

    return 'sync';
};

const gulpConfig = require('./gulp.config');

const defaultManifestConfig = {
    patterns: [
        {
            name: 'allActions',
            type: 'actions',
            pattern: /actions.jsx?$/,
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
};

const manifestConfig = require('./manifest.config')(defaultManifestConfig);

/**
 * Use liberally for additional core configuration.
 * @type {Object}
 */
module.exports = {
    version: '3.0.17',
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
                    version: '>=3.0.0',
                    destination: '/Dockerfile',
                    source: '/tmp/update/Dockerfile',
                },
                {
                    overwrite: true,
                    version: '>=2.3.16',
                    destination: '/src/app/plugable',
                    source: '/tmp/update/src/app/plugable',
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
            ],
            remove: [],
        },
    },
    manifest: manifestConfig,
};
