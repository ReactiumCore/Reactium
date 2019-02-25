const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const run = require('gulp-run');
const op = require('object-path');
const prettier = require('prettier');
const globby = require('globby');

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        package: ({ action, params, props }) => {
            const { destination, package, source } = params;

            const fpath = path.join(source, 'package.json');
            const dpath = path.join(destination, 'package.json');

            let pkg;

            try {
                message(`Updating ${chalk.cyan('package.json')}...`);
                pkg = require(fpath);
            } catch (err) {
                message(`Creating ${chalk.cyan('package.json')}...`);
                pkg = {};
            }

            pkg = { ...pkg, ...package };

            const content = prettier.format(JSON.stringify(pkg), {
                parser: 'json-stringify',
            });

            fs.writeFileSync(fpath, content);
            fs.ensureDirSync(destination);
            //fs.copySync(fpath, dpath);

            return Promise.resolve({ action, status: 200 });
        },
        assets: ({ action, params, props }) => {
            const { destination, source } = params;

            const globs = [`${source}/**/*`, `!{*.js}`];
            const files = globby
                .sync(globs)
                .filter(file =>
                    Boolean(
                        file.substr(-3) !== '.js' && file.substr(-3) !== 'jsx',
                    ),
                );

            files.forEach(file => {
                const dpath = file.replace(source, destination);
                fs.ensureFileSync(dpath);
                fs.copySync(file, dpath);
            });

            return Promise.resolve({ action, status: 200 });
        },
        create: ({ action, params, props }) => {
            const { source, destination } = params;

            message(
                `Creating library from ${chalk.cyan(path.basename(source))}...`,
            );

            let babel = new run.Command(
                `cross-env NODE_ENV=production babel ${source} --out-dir ${destination}`,
                { verbosity: 3 },
            );

            babel.exec();

            return Promise.resolve({ action, status: 200 });
        },
    };
};
