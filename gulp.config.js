"use strict";

const path = require("path");
const globby = require("globby");

module.exports = () => {
    return {
        entries: globby
            .sync("./src/app/*.js")
            .map(p => path.resolve(p))
            .reduce((entries, entry) => {
                entries[path.parse(entry).name] = entry;
                return entries;
            }, {}),
        defines: {},
        browsers: "last 1 version",
        port: {
            browsersync: 3000,
            proxy: 3030
        },
        cssPreProcessor: "sass",
        watch: {
            js: ["src/app/**/*"],
            markup: ["src/**/*.html", "src/assets/style/**/*.css"],
            style: [
                "src/**/*.less",
                "src/**/*.scss",
                "src/**/*.sass",
                ".core/**/*.less",
                ".core/**/*.scss",
                ".core/**/*.sass"
            ],
            assets: [
                "src/**/assets/**/*",
                "src/assets/**/*",
                "!{src/**/assets/style,src/**/*/assets/style/**}",
                "!{src/**/*/assets/js,src/**/*/assets/js/**}",
                "!{src/assets/style,src/assets/style/**}",
                "!{src/assets/js,src/assets/js/**}"
            ],
            server: ["src/index.js", "src/server/**/*.js"],
            templates: ["src/server/**/*.hbs"]
        },
        src: {
            app: "src",
            js: ["src/app/**/*"],
            markup: ["src/**/*.html"],
            style: ["src/**/*.scss", "!{src/**/_*.scss}"],
            assets: [
                "src/**/assets/**/*",
                "src/assets/**/*",
                "!{src/**/assets/style,src/**/*/assets/style/**}",
                "!{src/**/*/assets/js,src/**/*/assets/js/**}",
                "!{src/assets/style,src/assets/style/**}",
                "!{src/assets/js,src/assets/js/**}"
            ],
            includes: ["./node_modules"],
            appdir: path.resolve(__dirname, "src/app"),
            rootdir: path.resolve(__dirname)
        },
        dest: {
            dist: "public",
            js: "public/assets/js",
            markup: "public",
            style: "public/assets/style",
            assets: "public/assets"
        }
    };
};
