/**
 * Use liberally for additional core configuration.
 * @type {Object}
 */
module.exports = {
    version: '2.3.8',
    semver: '2.3.x',
    update: {
        package: {
            devDependencies: {
                add: {
                    'gulp-run': '^1.7.1',
                    'atomic-reactor-cli': '^2.0.6',
                },
                remove: [],
            },
            dependencies: {
                add: {
                    'react-frame-component': '^4.0.1',
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
};
