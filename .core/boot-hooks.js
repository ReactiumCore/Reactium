import path from 'path';
import op from 'object-path';
import _ from 'underscore';
const globby = require('./globby-patch').sync;

global.rootPath = path.resolve(__dirname, '..');

module.exports = async () => {
    // include boot DDD artifacts
    if (!global.bootHooks) {
        global.bootHooks = globby([
            `${rootPath}/.core/**/reactium-boot.js`,
            `${rootPath}/src/**/reactium-boot.js`,
            `${rootPath}/reactium_modules/**/reactium-boot.js`,
            `${rootPath}/node_modules/**/reactium-plugin/**/reactium-boot.js`,
        ]);
    }

    if (!global.bootHookLoaded) {
        DEBUG('Loading boot hooks.');
        global.bootHookLoaded = [];
        global.bootHooks.map(item => {
            if (!bootHookLoaded.includes(item)) {
                const p = path.normalize(item);
                require(p);
                bootHookLoaded.push(item);
            }
        });

        ReactiumBoot.Hook.runSync('sdk-init', ReactiumBoot);
        await ReactiumBoot.Hook.run('sdk-init', ReactiumBoot);
    } else {
        DEBUG('Boot hooks already loaded.');
    }
};
