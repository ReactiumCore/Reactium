'use strict';

const fs = require('fs');
const path = require('path');
const globby = require('./globby-patch');
const rootPath = path.resolve(__dirname, '..');

const defaultConfig = {
    rootPath,
    entries: globby
        .sync('./src/app/*.js')
        .map(p => path.resolve(p))
        .reduce((entries, entry) => {
            entries[path.parse(entry).name] = entry;
            return entries;
        }, {}),
    defines: {},
    browsers: 'last 1 version',
    port: {
        browsersync: 3000,
        proxy: 3030,
    },
    serverRetries: 4,
    serverRetryDelay: 2000,
    open: true,
    watch: {
        js: ['src/app/**/*', 'reactium_modules/**/*'],
        markup: ['src/**/*.html', 'src/**/*.css', 'reactium_modules/**/*.css'],
        colors: ['src/**/*/colors.json'],
        pluginAssets: ['src/app/**/plugin-assets.json'],
        restartWatches: [
            'src/**/assets/style/*.scss',
            '!src/**/assets/style/_*.scss',
        ],
        style: [
            'src/**/*.scss',
            '.core/**/*.scss',
            'reactium_modules/**/*.scss',
            '!{src/**/assets/style/*.scss}',
            '!{reactium_modules/**/assets/style/*.scss}',
        ],
        assets: [
            'src/**/assets/**/*',
            'src/assets/**/*',
            'reactium_modules/**/assets/**/*',
            '!{src/**/*/assets/style,src/**/*/assets/style/**,reactium_modules/**/assets/style/**}',
            '!{src/**/*/assets/js,src/**/*/assets/js/**,reactium_modules/**/assets/js/**}',
            '!{src/assets/style,src/assets/style/**}',
            '!{src/assets/js,src/assets/js/**}',
        ],
        server: ['src/index.js', 'src/server/**/*.js'],
        templates: ['src/server/**/*.hbs'],
    },
    src: {
        app: 'src',
        colors: ['src/**/*/colors.json'],
        pluginAssets: ['src/app/**/plugin-assets.json'],
        js: ['src/app/**/*'],
        json: ['src/**/*.json'],
        markup: ['src/**/*.html', 'src/**/*.css', 'reactium_modules/**/*.css'],
        style: [
            'src/**/*.scss',
            '.core/**/*.scss',
            'reactium_modules/**/*.scss',
            '!{src/**/_*.scss}',
            '!{.core/**/_*.scss}',
            '!{reactium_modules/**/_*.scss}',
        ],
        styleDDD: [
            'src/**/*/_reactium-style*.scss',
            'reactium_modules/**/*/_reactium-style*.scss',
        ],
        assets: [
            '.core/assets/**/*',
            'src/**/assets/**/*',
            'reactium_modules/**/assets/**/*',
            'src/assets/**/*',
            '!{src/**/*/assets/style,src/**/*/assets/style/**,reactium_modules/**/assets/style/**}',
            '!{src/**/*/assets/js,src/**/*/assets/js/**,reactium_modules/**/assets/js/**}',
            '!{src/assets/style,src/assets/style/**}',
            '!{src/assets/js,src/assets/js/**}',
        ],
        compress: [
            'public/assets/**/*',
            'public/assets/js/sw/**/*',
            '!public/assets/js/*.js',
            '!public/assets/**/*.gz',
        ],
        includes: ['./node_modules'],
        appdir: path.resolve(__dirname, 'src/app'),
        rootdir: path.resolve(__dirname),
        manifest: path.normalize(`${rootPath}/src/manifest.js`),
        externalsManifest: path.normalize(
            `${rootPath}/.tmp/externals-manifest.js`,
        ),
        reactiumModules: path.normalize(`${rootPath}/reactium_modules`),
    },
    dest: {
        dist: 'public',
        js: '../public/assets/js',
        markup: 'public',
        style: 'public/assets/style',
        assets: 'public/assets',
        static: 'dist',
        library: 'lib',
        build: 'build/src',
        buildCore: 'build/core',
        colors: 'src/assets/style/_scss/_colors.scss',
        modulesPartial: 'src/assets/style/_scss/_reactium-modules.scss',
        startPath: '/',
    },
    umd: {
        defaultWorker: path.resolve(
            __dirname,
            '../public/assets/js/umd/service-worker/service-worker.js',
        ),
        manifest: path.normalize(`${rootPath}/.tmp/umd-manifest.json`),
        outputPath: path.resolve(__dirname, '../public/assets/js/umd'),
    },
    sw: {
        globDirectory: 'public',
        globPatterns: ['**/*.{html,js,css,js.gz,css.gz}'],
        globIgnores: ['**/index-static.html', 'docs/**/*', 'assets/js/sw/**/*'],
        swDest: 'public/assets/js/sw/sw.js',
        modifyURLPrefix: {
            assets: '/assets',
        },
    },
    docs: {
        src: '.core,src/app,node_modules/@atomic-reactor',
        dest: ['public/docs', 'docs'],
        verbose: false,
    },
    buildTasks: [
        'preBuild',
        'ensureReactiumModules',
        'clean',
        'manifest',
        ['markup', 'json'],
        ['assets', 'styles'],
        'scripts',
        'umdLibraries',
        'serviceWorker',
        'compress',
        'apidocs',
        'postBuild',
    ],
};

const overrides = config => {
    globby
        .sync([
            './gulp.config.override.js',
            './node_modules/**/reactium-plugin/gulp.config.override.js',
            './src/**/gulp.config.override.js',
            './reactium_modules/**/gulp.config.override.js',
        ])
        .forEach(file => require(path.resolve(file))(config));

    return config;
};

module.exports = overrides(defaultConfig);
