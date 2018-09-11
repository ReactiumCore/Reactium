/**
 * Currently, this file is used by Atomic-Reactor/CLI to determine version of core
 * being used.
 *
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
                    'gulp-run': '^1.7.1'
                },
                remove: []
            },
            dependencies: {
                add: {},
                remove: []
            },
            scripts: {
                add: {
                    build: 'npm install --production-only',
                    static: 'npm-run-all build:* && gulp static',
                    local: 'gulp local',
                    'local:ssr': 'gulp local:ssr'
                },
                remove: [
                    'local-fe-start',
                    'local-fe:gulp',
                    'local-fe:babel-node',
                    'local-ssr-start',
                    'local-ssr:gulp',
                    'local-ssr:babel-node',
                    'static:build'
                ]
            }
        }
    }
};
