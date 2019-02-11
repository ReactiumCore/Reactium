/**
 * Use liberally for additional core configuration.
 * @type {Object}
 */
module.exports = {
    version: '2.4.6',
    semver: '^2.0.0',
    update: {
        package: {
            devDependencies: {
                add: {
                    'gulp-run': '^1.7.1',
                    'atomic-reactor-cli': '^2.0.21',
                    'babel-core': '^7.0.0-bridge.0',
                    'babel-jest': '^23.6.0',
                    '@babel/core': '^7.1.2',
                    '@babel/preset-env': '^7.1.0',
                    '@babel/preset-react': '^7.0.0',
                    '@babel/plugin-proposal-class-properties': '^7.1.0',
                    'babel-loader': '^8.0.4',
                    camelcase: '^5.0.0',
                    'cli-spinners': '^1.3.1',
                    decamelize: '^2.0.0',
                    enzyme: '^3.8.0',
                    'enzyme-adapter-react-16': '^1.7.1',
                    'fast-diff': '^1.2.0',
                    'fs-extra': '^7.0.1',
                    'fs-readdir-recursive': '^1.1.0',
                    gulp: '^4.0.0',
                    'gulp4-run-sequence': '^0.2.1',
                    handlebars: '^4.0.12',
                    jest: '^23.6.0',
                    'module-alias': '^2.1.0',
                    ora: '^3.0.0',
                    slugify: '^1.3.3',
                    'webpack-filter-warnings-plugin': '^1.2.0',
                    eslint: '^5.12.0',
                    'eslint-plugin-react': '^7.11.1',
                    'babel-eslint': '^10.0.1',
                    'node-sass': '^4.11.0',
                    'node-sass-functions-json': '^1.0.0',
                    'node-sass-tilde-importer': '^1.0.2',
                },
                remove: [
                    'atomic-reactor-cli',
                    'babel-cli',
                    'babel-core',
                    'babel-loader',
                    'babel-preset-env',
                    'babel-preset-react',
                    'babel-preset-stage-2',
                    'run-sequence',
                ],
            },
            dependencies: {
                add: {
                    '@babel/cli': '^7.1.2',
                    '@babel/node': '^7.0.0',
                    '@babel/polyfill': '^7.0.0',
                    gsap: '^2.0.2',
                    'http-proxy-middleware': '^0.19.1',
                    prettier: '^1.15.1',
                    'react-frame-component': '^4.0.1',
                    'react-redux': '^6.0.0',
                    'redbox-react': '^1.6.0',
                    'redux-devtools': '^3.5.0',
                    'redux-super-thunk': '^0.0.7',
                    'run-script-os': '^1.0.5',
                    xss: '^1.0.3',
                },
                remove: ['beautify', 'express-http-proxy'],
            },
            scripts: {
                add: {
                    build: 'npm install --production-only',
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
                    version: '>=2.3.16',
                    destination: '/src/app/plugable',
                    source: '/tmp/update/src/app/plugable',
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
                filePattern: '.jsx?$',
            },
            common: {
                modulePath: 'components/common-ui/',
                filePattern: '.jsx?$',
            },
            toolkit: {
                modulePath: 'toolkit',
                filePattern: '.jsx?$',
            },
            core: {
                modulePath: 'reactium-core/components',
                filePattern: '.jsx?$',
            },
        },
    },
    library: {
        patterns: [
            {
                name: 'allLibraryComponents',
                type: 'library',
                pattern: /library.jsx?$/,
            },
        ],
        sourceMappings: [
            {
                from: 'src/app/',
                to: '',
            },
        ],
        contexts: {},
    },
};
