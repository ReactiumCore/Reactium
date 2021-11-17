const ReactiumBabel = require('@atomic-reactor/reactium-sdk-core').default;
const fs = require('fs');
const path = require('path');
const globby = require('./globby-patch').sync;
const rootPath = path.resolve(__dirname, '..');
const chalk = require('chalk');
const semver = require('semver');
const op = require('object-path');
const babelCoreVersion = op.get(
    require(path.resolve(
        path.dirname(require.resolve('@babel/core')),
        '../package.json',
    )),
    'version',
);
const coreJsVersion = op.get(
    require(path.resolve(
        path.dirname(require.resolve('core-js')),
        'package.json',
    )),
    'version',
);

let corejs;
// annoying warning starts with @babel/core 7.4.0
if (semver.satisfies(semver.coerce(babelCoreVersion), '^7.4.0')) {
    if (semver.satisfies(semver.coerce(coreJsVersion), '>=2.0.0')) {
        corejs = '2';
    }
    if (semver.satisfies(semver.coerce(coreJsVersion), '>=3.0.0')) {
        corejs = '3';
    }
}

require('./reactium.log');

global.ReactiumBabel = ReactiumBabel;

// Load reactium-gulp DDD artifact from plugin sources
globby([
    `${rootPath}/.core/**/reactium-babel.js`,
    `${rootPath}/src/**/reactium-babel.js`,
    `${rootPath}/reactium_modules/**/reactium-babel.js`,
    `${rootPath}/node_modules/**/reactium-plugin/**/reactium-babel.js`,
]).forEach(item => {
    const p = path.normalize(item);
    try {
        require(p);
    } catch (error) {
        console.error(chalk.red(`Error loading ${p}:`));
        console.error(error);
    }
});

/**
 * Babel Module Aliases - for babel-plugin-module-resolver
 */
ReactiumBabel.ModuleAliases = ReactiumBabel.Utils.registryFactory(
    'BabelAliases',
    'alias',
    ReactiumBabel.Utils.Registry.MODES.CLEAN,
);
ReactiumBabel.ModuleAliases.register('externals', {
    path: './.tmp/externals-manifest',
});
ReactiumBabel.ModuleAliases.register('manifest', {
    path: './src/manifest',
});
ReactiumBabel.ModuleAliases.register('appdir', { path: './src/app' });
ReactiumBabel.ModuleAliases.register('components', {
    path: './src/app/components',
});
ReactiumBabel.ModuleAliases.register('reactium-core', {
    path: './.core',
});
ReactiumBabel.ModuleAliases.register('reactium_modules', {
    path: './reactium_modules',
});
ReactiumBabel.ModuleAliases.register('dependencies', {
    path: './.core/dependencies',
});
ReactiumBabel.ModuleAliases.register('toolkit', {
    path: './src/app/toolkit',
});
ReactiumBabel.ModuleAliases.register('reactium-translations', {
    path: './src/reactium-translations',
});

ReactiumBabel.Hook.runSync('aliases', ReactiumBabel.ModuleAliases);

/**
 * @babel/env configuration
 */
ReactiumBabel.env = {
    ...(corejs ? { corejs } : {}),
    useBuiltIns: 'usage',
    debug: false,
    targets: {
        browsers: ['> 1%', 'IE 11'],
    },
};
ReactiumBabel.Hook.runSync('env', ReactiumBabel.env);

/**
 * Babel Presets
 */
ReactiumBabel.Presets = ReactiumBabel.Utils.registryFactory(
    'BabelPreset',
    'name',
    ReactiumBabel.Utils.Registry.MODES.CLEAN,
);
ReactiumBabel.Presets.register('@babel/react', {
    preset: '@babel/react',
    envs: ['default', 'test', 'library'],
});
ReactiumBabel.Presets.register('@babel/env', {
    preset: ['@babel/env', ReactiumBabel.env],
    envs: ['default', 'test', 'library'],
});
ReactiumBabel.Presets.register('@babel/preset-flow', {
    preset: '@babel/preset-flow',
    envs: ['default', 'test', 'library'],
});

ReactiumBabel.Hook.runSync('presets', ReactiumBabel.Presets);

/**
 * Babel Plugins
 */
ReactiumBabel.Plugins = ReactiumBabel.Utils.registryFactory(
    'BabelPlugins',
    'name',
    ReactiumBabel.Utils.Registry.MODES.CLEAN,
);

ReactiumBabel.Plugins.register('@babel/plugin-syntax-dynamic-import', {
    plugin: ['@babel/plugin-syntax-dynamic-import'],
    envs: ['default', 'test', 'library'],
});

ReactiumBabel.Plugins.register('module-resolver', {
    plugin: [
        'module-resolver',
        {
            cwd: rootPath,
            alias: ReactiumBabel.ModuleAliases.list.reduce(
                (aliases, { alias, path }) => {
                    aliases[alias] = path;
                    return aliases;
                },
                {},
            ),
        },
    ],
    envs: ['default', 'test', 'library'],
});

ReactiumBabel.Plugins.register('@babel/plugin-proposal-class-properties', {
    plugin: ['@babel/plugin-proposal-class-properties', { loose: true }],
    envs: ['default', 'test', 'library'],
});

ReactiumBabel.Plugins.register('@babel/plugin-proposal-export-default-from', {
    plugin: ['@babel/plugin-proposal-export-default-from'],
    envs: ['default', 'test', 'library'],
});

ReactiumBabel.Plugins.register('@babel/plugin-proposal-private-methods', {
    plugin: ['@babel/plugin-proposal-private-methods', { loose: true }],
    envs: ['default', 'test', 'library'],
});

ReactiumBabel.Plugins.register(
    '@babel/plugin-proposal-private-property-in-object',
    {
        plugin: [
            '@babel/plugin-proposal-private-property-in-object',
            { loose: true },
        ],
        envs: ['default', 'test', 'library'],
    },
);

ReactiumBabel.Hook.runSync('plugins', ReactiumBabel.Plugins);

ReactiumBabel.envs = ['default', 'test', 'library'];
ReactiumBabel.Hook.runSync('envs', ReactiumBabel.envs);

const config = {
    presets: ReactiumBabel.Presets.list
        .filter(preset => op.get(preset, 'envs', []).includes('default'))
        .map(({ preset }) => preset),
    plugins: ReactiumBabel.Plugins.list
        .filter(plugin => op.get(plugin, 'envs', []).includes('default'))
        .map(({ plugin }) => plugin),
    env: ReactiumBabel.envs
        .filter(env => env !== 'default')
        .reduce((envs, env) => {
            envs[env] = {
                presets: ReactiumBabel.Presets.list
                    .filter(preset => op.get(preset, 'envs', []).includes(env))
                    .map(({ preset }) => preset),
                plugins: ReactiumBabel.Plugins.list
                    .filter(plugin => op.get(plugin, 'envs', []).includes(env))
                    .map(({ plugin }) => plugin),
            };
            return envs;
        }, {}),
};

ReactiumBabel.Hook.runSync('config', config);

module.exports = config;
