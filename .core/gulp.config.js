'use strict';

const fs = require('fs');
const path = require('path');
const globby = require('globby');
const rootPath = path.resolve(__dirname, '..');

const defaultConfig = {
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
    open: true,
    cssPreProcessor: 'sass',
    watch: {
        js: ['src/app/**/*'],
        markup: ['src/**/*.html', 'src/**/*.css'],
        colors: ['src/**/*/colors.json'],
        pluginAssets: ['src/app/**/plugin-assets.json'],
        restartWatches: [
            'src/**/assets/style/*.less',
            'src/**/assets/style/*.scss',
            'src/**/assets/style/*.sass',
            '.core/components/Toolkit/style.scss',
            '!src/**/assets/style/_*.less',
            '!src/**/assets/style/_*.scss',
            '!src/**/assets/style/_*.sass',
        ],
        style: [
            'src/**/*.less',
            'src/**/*.scss',
            'src/**/*.sass',
            '.core/**/*.less',
            '.core/**/*.scss',
            '.core/**/*.sass',
            '!{src/**/assets/style/*.less}',
            '!{src/**/assets/style/*.scss}',
            '!{src/**/assets/style/*.sass}',
            '!{.core/components/Toolkit/style.scss}',
        ],
        assets: [
            'src/**/assets/**/*',
            'src/assets/**/*',
            '!{src/**/*/assets/style,src/**/*/assets/style/**}',
            '!{src/**/*/assets/js,src/**/*/assets/js/**}',
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
        markup: ['src/**/*.html', 'src/**/*.css'],
        style: [
            'src/**/*.scss',
            '.core/**/*.scss',
            '!{src/**/_*.scss}',
            '!{.core/**/_*.scss}',
        ],
        assets: [
            '.core/assets/**/*',
            'src/**/assets/**/*',
            'src/assets/**/*',
            '!{src/**/*/assets/style,src/**/*/assets/style/**}',
            '!{src/**/*/assets/js,src/**/*/assets/js/**}',
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
        globIgnores: ['**/index-static.html'],
        swDest: 'public/assets/js/sw/sw.js',
        clientsClaim: true,
        skipWaiting: true,
        modifyURLPrefix: {
            assets: '/assets',
        },
    },
    docs: {
        src: '.core,src/app,node_modules/@atomic-reactor',
        dest: ['public/docs', 'docs'],
        verbose: false,
    },
};

let gulpConfigOverride = _ => _;
if (fs.existsSync(`${rootPath}/gulp.config.override.js`)) {
    gulpConfigOverride = require(`${rootPath}/gulp.config.override.js`);
}

module.exports = gulpConfigOverride(defaultConfig);
