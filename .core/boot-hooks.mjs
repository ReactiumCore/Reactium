import _ from 'underscore';
import path from 'node:path';
import globbyPatched from './globby-patch.js'
import { dirname } from '@atomic-reactor/dirname';

const __dirname = dirname(import.meta.url);
const globby = globbyPatched.sync;

global.rootPath = path.resolve(__dirname, '..');

export default async () => {
    // include boot DDD artifacts
    if (!global.bootHooks) {
        global.bootHooks = globby([
            `${rootPath}/.core/**/reactium-boot.js`,
            `${rootPath}/.core/**/reactium-boot.mjs`,
            `${rootPath}/.core/**/reactium-boot.cjs`,
            `${rootPath}/src/**/reactium-boot.js`,
            `${rootPath}/src/**/reactium-boot.mjs`,
            `${rootPath}/src/**/reactium-boot.cjs`,
            `${rootPath}/reactium_modules/**/reactium-boot.js`,
            `${rootPath}/reactium_modules/**/reactium-boot.mjs`,
            `${rootPath}/reactium_modules/**/reactium-boot.cjs`,
            `${rootPath}/node_modules/**/reactium-plugin/**/reactium-boot.js`,
            `${rootPath}/node_modules/**/reactium-plugin/**/reactium-boot.mjs`,
            `${rootPath}/node_modules/**/reactium-plugin/**/reactium-boot.cjs`,
        ]);
    }

    if (!global.bootHookLoaded) {
        DEBUG('Loading boot hooks.');
        global.bootHookLoaded = [];
        for (const item of global.bootHooks) {
            if (!bootHookLoaded.includes(item)) {
                const p = path.normalize(item);
                await import(p);
                bootHookLoaded.push(item);
            }
        }
 
        ReactiumBoot.Hook.runSync('sdk-init', ReactiumBoot);
        await ReactiumBoot.Hook.run('sdk-init', ReactiumBoot);
    } else {
        DEBUG('Boot hooks already loaded.');
    }
};
