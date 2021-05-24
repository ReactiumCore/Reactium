const ReactiumWebpack = require('@atomic-reactor/reactium-sdk-core').default;
const op = require('object-path');
const _ = require('underscore');
const webpack = require('webpack');
const globby = require('./globby-patch');
const chalk = require('chalk');
const path = require('path');

global.ReactiumWebpack = ReactiumWebpack;

const matchChunk = (test, debug) => module => {
    const chunkNames = [];
    for (const chunk of module.chunksIterable) {
        chunkNames.push(chunk.name);
    }

    const names = _.compact(
        _.flatten([
            module.nameForCondition && module.nameForCondition(),
            chunkNames,
        ]),
    );

    const match = !!names.find(name => test.test(name));
    if (debug && match) {
        console.log({
            test: test.toString(),
            name: module.nameForCondition && module.nameForCondition(),
            chunkNames,
        });
    }

    return match;
};

let artifacts = {};
class WebpackReactiumWebpack {
    constructor(name, ddd, context) {
        this.name = name;
        this.context = context;

        // setter/getter initial values
        this.entryValue = {
            main: './src/app/main.js',
        };
        this.modeValue = 'development';
        this.targetValue = 'web';
        this.outputValue = {};
        this.devtoolValue = '';
        this.optimizationValue = {
            minimize: false,
        };

        this.ignores = ReactiumWebpack.Utils.registryFactory(
            'ignores',
            'id',
            ReactiumWebpack.Utils.Registry.MODES.CLEAN,
        );
        this.ignores.sdk = this;

        this.externals = ReactiumWebpack.Utils.registryFactory(
            'externals',
            'id',
            ReactiumWebpack.Utils.Registry.MODES.CLEAN,
        );
        this.externals.sdk = this;

        this.rules = ReactiumWebpack.Utils.registryFactory(
            'rules',
            'id',
            ReactiumWebpack.Utils.Registry.MODES.CLEAN,
        );
        this.rules.sdk = this;

        this.plugins = ReactiumWebpack.Utils.registryFactory(
            'plugins',
            'id',
            ReactiumWebpack.Utils.Registry.MODES.CLEAN,
        );
        this.plugins.sdk = this;

        this.overridesValue = {};

        // avoid costly globbing
        if (op.get(artifacts, [ddd])) return;

        globby
            .sync([
                `./${ddd}`,
                `./node_modules/**/reactium-plugin/${ddd}`,
                `./src/**/${ddd}`,
                `./reactium_modules/**/${ddd}`,
            ])
            .forEach(file => {
                try {
                    require(path.resolve(file));
                } catch (error) {
                    console.error(chalk.red(`Error loading ${file}:`));
                    console.error(error);
                }
            });

        op.set(artifacts, [ddd], true);
    }

    set mode(value) {
        this.modeValue = value;
    }

    get mode() {
        return this.modeValue;
    }

    set entry(value) {
        this.entryValue = value;
    }

    get entry() {
        return this.entryValue;
    }

    set target(value) {
        this.targetValue = value;
    }

    get target() {
        return this.targetValue;
    }

    set output(value) {
        this.outputValue = value;
    }

    get output() {
        return this.outputValue;
    }

    set devtool(value) {
        this.devtoolValue = value;
    }

    get devtool() {
        return this.devtoolValue;
    }

    set optimization(value) {
        this.optimizationValue = value;
    }

    get optimization() {
        return this.optimizationValue;
    }

    set overrides(value) {
        this.overridesValue = value;
    }

    get overrides() {
        return this.overridesValue || {};
    }

    addRule(id, rule) {
        this.rules.register(id, { rule });
    }

    addIgnore(id, test) {
        this.ignores.register(id, { test });
    }

    addPlugin(id, plugin) {
        this.plugins.register(id, { plugin });
    }

    addContext(id, context) {
        const { from, to } = context;
        this.plugins.register(id, {
            plugin: new webpack.ContextReplacementPlugin(from, context => {
                context.request = to;
            }),
        });
    }

    addExternal(id, config) {
        const { key, value } = config;
        if (typeof key === 'string' || key instanceof String) {
            // regex string
            if (/^\/.*\/i?$/.test(key)) {
                const args = [key.replace(/^\//, '').replace(/\/i?$/, '')];
                if (/i$/.test(key)) args.push('i');
                this.externals.register(id, { external: new RegExp(...args) });
                // string keypair
            } else {
                this.externals.register(id, { external: { key, value } });
            }
        } else if (typeof value === 'object' && value instanceof RegExp) {
            this.externals.register(id, { external: value });
        } else if (Array.isArray(value)) {
            this.externals.register(id, { external: { key, value } });
        } else if (typeof value === 'function') {
            this.externals.register(id, { external: value });
        }
    }

    getIgnores() {
        ReactiumWebpack.Hook.runSync(
            'ignores',
            this.ignores,
            this.name,
            this.context,
        );

        const ignores = this.ignores.list;
        if (ignores.length > 0) {
            return {
                test: ignores.map(ignore => ignore.test),
                use: [
                    {
                        loader: 'ignore-loader',
                    },
                ],
            };
        }

        return false;
    }

    getExternals() {
        ReactiumWebpack.Hook.runSync(
            'externals',
            this.externals,
            this.name,
            this.context,
        );
        return _.compact(
            this.externals.list.map(({ external }) => {
                if (typeof external === 'object' && 'key' in external) {
                    const { key, value } = external;
                    return { [key]: value };
                }

                return external;
            }),
        );
    }

    getRules() {
        ReactiumWebpack.Hook.runSync(
            'rules',
            this.rules,
            this.name,
            this.context,
        );
        return this.rules.list.map(({ id, rule }) => rule);
    }

    getPlugins() {
        ReactiumWebpack.Hook.runSync(
            'plugins',
            this.plugins,
            this.name,
            this.context,
        );
        return this.plugins.list.map(({ id, plugin }) => plugin);
    }

    matchChunk(test, debug) {
        return module => {
            const chunkNames = [];
            for (const chunk of module.chunksIterable) {
                chunkNames.push(chunk.name);
            }

            const names = _.compact(
                _.flatten([
                    module.nameForCondition && module.nameForCondition(),
                    chunkNames,
                ]),
            );

            const match = !!names.find(name => test.test(name));
            if (debug && match) {
                console.log({
                    test: test.toString(),
                    name: module.nameForCondition && module.nameForCondition(),
                    chunkNames,
                });
            }

            return match;
        };
    }

    setNoCodeSplitting(env) {
        this.optimizationValue = {
            minimize: Boolean(env !== 'development'),
        };

        this.addPlugin(
            'limit-chunks',
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1,
            }),
        );
    }

    setWebpackDefaultOptimize(env) {
        this.optimizationValue = {
            minimize: Boolean(env !== 'development'),
            splitChunks: {
                chunks: 'async',
                minSize: 20000,
                minRemainingSize: 0,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                enforceSizeThreshold: 50000,
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        reuseExistingChunk: true,
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                },
            },
        };
    }

    setCodeSplittingOptimize(env) {
        this.optimizationValue = {
            minimize: Boolean(env !== 'development'),
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendors: {
                        test: this.matchChunk(/[\\/]node_modules[\\/]/),
                        priority: -10,
                        reuseExistingChunk: true,
                    },
                    core: {
                        test: this.matchChunk(/[\\/]\.core/),
                        priority: -10,
                        reuseExistingChunk: true,
                    },
                    sdk: {
                        test: this.matchChunk(/[\\/]\.core[\\/]sdk/),
                        priority: -20,
                        priority: 0,
                        reuseExistingChunk: true,
                    },
                    sw: {
                        test: this.matchChunk(/[\\/]node_modules[\\/]workbox/),
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                },
            },
        };
    }

    config() {
        ReactiumWebpack.Hook.runSync('before-config', this);

        return {
            mode: this.mode,
            target: this.target,
            output: this.output,
            entry: this.entry,
            devtool: this.devtool,
            optimization: this.optimization,
            externals: this.getExternals(),
            module: {
                rules: _.compact(
                    [...this.getRules()].concat(this.getIgnores()),
                ),
            },
            plugins: this.getPlugins(),
            ...this.overrides,
        };
    }
}

module.exports = WebpackReactiumWebpack;
