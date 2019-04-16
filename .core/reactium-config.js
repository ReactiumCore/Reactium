const contextMode = () => {
    if (
        process.env.NODE_ENV !== 'development' ||
        process.env.LAZY_GET_COMPONENTS === 'on'
    ) {
        return 'lazy-once';
    }

    return 'sync';
};

/**
 * Use liberally for additional core configuration.
 * @type {Object}
 */
module.exports = {
    version: '3.0.6',
    semver: '^3.0.0',
    update: {
        package: {
            devDependencies: {
                add: {
                    'gulp-run': '^1.7.1',
                    'atomic-reactor-cli': '^2.0.21',
                    'babel-core': '^7.0.0-bridge.0',
                    'babel-jest': '^24.1.0',
                    '@babel/core': '^7.3.3',
                    '@babel/preset-env': '^7.1.0',
                    '@babel/preset-react': '^7.0.0',
                    '@babel/plugin-proposal-class-properties': '^7.1.0',
                    '@babel/plugin-proposal-export-default-from': '^7.2.0',
                    'babel-loader': '^8.0.4',
                    camelcase: '^5.0.0',
                    'compression-webpack-plugin': '^2.0.0',
                    'cli-spinners': '^1.3.1',
                    decamelize: '^2.0.0',
                    enzyme: '^3.8.0',
                    'enzyme-adapter-react-16': '^1.7.1',
                    'fast-diff': '^1.2.0',
                    'fs-extra': '^7.0.1',
                    'fs-readdir-recursive': '^1.1.0',
                    gulp: '^4.0.0',
                    'gulp-autoprefixer': '^6.0.0',
                    'gulp4-run-sequence': '^0.3.1',
                    'gulp-sourcemaps': '^2.6.5',
                    'gulp-clean-css': '^4.0.0',
                    'gulp-gzip': '^1.4.2',
                    handlebars: '^4.0.12',
                    jest: '^24.1.0',
                    'module-alias': '^2.1.0',
                    ora: '^3.0.0',
                    slugify: '^1.3.3',
                    webpack: '^4.29.5',
                    'webpack-dev-middleware': '^3.6.0',
                    'webpack-filter-warnings-plugin': '^1.2.0',
                    'webpack-visualizer-plugin': '^0.1.11',
                    eslint: '^5.12.0',
                    'eslint-plugin-react': '^7.11.1',
                    'eslint-plugin-react-hooks': '^1.5.1',
                    'babel-eslint': '^10.0.1',
                    'node-sass': '^4.11.0',
                    'node-sass-functions-json': '^1.0.0',
                    'node-sass-tilde-importer': '^1.0.2',
                    stylelint: '^9.10.1',
                },
                remove: [
                    'atomic-reactor-cli',
                    'babel-cli',
                    'babel-core',
                    '@babel/core',
                    'babel-jest',
                    'babel-loader',
                    'babel-preset-env',
                    'babel-preset-react',
                    'babel-preset-stage-2',
                    'gulp-autoprefixer',
                    'gulp-sourcemaps',
                    'gulp4-run-sequence',
                    'gulp-csso',
                    'jest',
                    'run-sequence',
                    'webpack',
                    'webpack-dev-middleware',
                    'webpack-visualizer-plugin',
                ],
            },
            dependencies: {
                add: {
                    '@babel/cli': '^7.2.3',
                    '@babel/node': '^7.2.2',
                    '@babel/polyfill': '^7.2.5',
                    '@babel/plugin-syntax-dynamic-import': '^7.2.0',
                    classnames: '^2.2.6',
                    eslint: '^5.14.1',
                    'express-static-gzip': '^1.1.3',
                    globby: '^9.0.0',
                    gsap: '^2.1.0',
                    'http-proxy-middleware': '^0.19.1',
                    marked: '^0.6.1',
                    prettier: '^1.15.1',
                    react: '^16.8.5',
                    'react-dom': '^16.8.5',
                    'react-frame-component': '^4.0.1',
                    'react-redux': '^6.0.0',
                    'react-router-config': '^5.0.0',
                    'react-router-dom': '^5.0.0',
                    'redbox-react': '^1.6.0',
                    'redux-devtools': '^3.5.0',
                    'redux-local-persist': '0.1.0',
                    'redux-super-thunk': '^0.0.7',
                    'run-script-os': '^1.0.5',
                    xss: '^1.0.3',
                },
                remove: [
                    '@babel/cli',
                    '@babel/node',
                    '@babel/polyfill',
                    'beautify',
                    'eslint',
                    'express-http-proxy',
                    'globby',
                    'gsap',
                    'marked',
                    'react',
                    'react-dom',
                    'react-redux',
                    'react-router-config',
                    'react-router-dom',
                    'redux-local-persist',
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
    manifest: {
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
    },
};
