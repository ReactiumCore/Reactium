/**
 * Use liberally for additional core configuration.
 * @type {Object}
 */
module.exports = {
    version: '2.3.9',
    semver: '2.3.x',
    update: {
        package: {
            devDependencies: {
                add: {
                    'gulp-run': '^1.7.1',
                    'atomic-reactor-cli': '^2.0.21',
                    '@babel/core': '^7.1.2',
                    '@babel/preset-env': '^7.1.0',
                    '@babel/preset-react': '^7.0.0',
                    'babel-loader': '^8.0.4',
                    'webpack-filter-warnings-plugin': '^1.2.0',
                },
                remove: [
                    'atomic-reactor-cli',
                    'babel-cli',
                    'babel-core',
                    'babel-loader',
                    'babel-preset-env',
                    'babel-preset-react',
                    'babel-preset-stage-2',
                ],
            },
            dependencies: {
                add: {
                    '@babel/cli': '^7.1.2',
                    '@babel/node': '^7.0.0',
                    '@babel/polyfill': '^7.0.0',
                    gsap: '^2.0.2',
                    'react-frame-component': '^4.0.1',
                    xss: '^1.0.3',
                },
                remove: ['beautify'],
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
                    'static:build',
                ],
            },
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
};
