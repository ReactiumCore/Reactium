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
        restartWatches: [
            'src/**/assets/style/*.less',
            'src/**/assets/style/*.scss',
            'src/**/assets/style/*.sass',
            '.core/components/Toolkit/style.scss',
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
            'src/**/assets/**/*',
            'src/assets/**/*',
            '!{src/**/*/assets/style,src/**/*/assets/style/**}',
            '!{src/**/*/assets/js,src/**/*/assets/js/**}',
            '!{src/assets/style,src/assets/style/**}',
            '!{src/assets/js,src/assets/js/**}',
        ],
        includes: ['./node_modules'],
        appdir: path.resolve(__dirname, 'src/app'),
        rootdir: path.resolve(__dirname),
        manifest: path.normalize(`${rootPath}/src/manifest.js`),
        library: path.normalize(`${rootPath}/src/lib.js`),
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
        colors: 'src/assets/style/_scss/_colors.scss',
    },
};

let gulpConfigOverride = _ => _;
if (fs.existsSync(`${rootPath}/gulp.config.override.js`)) {
    gulpConfigOverride = require(`${rootPath}/gulp.config.override.js`);
}

module.exports = gulpConfigOverride(defaultConfig);
