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
                    'atomic-reactor-cli': '^2.0.6',
                    '@babel/core': '^7.1.2',
                    '@babel/preset-env': '^7.1.0',
                    '@babel/preset-react': '^7.0.0',
                    'babel-loader': '^8.0.4',
                },
                remove: [
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
                remove: [],
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
                pattern: /actions.js$/,
            },
            {
                name: 'allActionTypes',
                type: 'actionTypes',
                pattern: /actionTypes.js$/,
            },
            {
                name: 'allReducers',
                type: 'reducers',
                pattern: /reducers.js$/,
            },
            {
                name: 'allInitialStates',
                type: 'state',
                pattern: /state.js$/,
            },
            {
                name: 'allRoutes',
                type: 'route',
                pattern: /route.js$/,
            },
            {
                name: 'allServices',
                type: 'services',
                pattern: /services.js$/,
            },
            {
                name: 'allMiddleware',
                type: 'middleware',
                pattern: /middleware.js$/,
            },
            {
                name: 'allEnhancers',
                type: 'enhancer',
                pattern: /enhancer.js$/,
            },
            {
                name: 'allPlugins',
                type: 'plugin',
                pattern: /plugin.js$/,
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
    },
};
