/**
 * Currently, this file is used by Atomic-Reactor/CLI to determine version of core
 * being used.
 *
 * Use liberally for additional core configuration.
 * @type {Object}
 */
module.exports = {
    version: '2.3.4',
    semver: '2.3.x',
    update: {
        package: {
            devDependencies: {
                add: {
                    'gulp-run': '^1.7.1'
                },
                remove: {}
            },
            dependencies: {
                add: {},
                remove: {}
            },
            scripts: {
                add: {},
                remove: {}
            }
        }
    }
};
