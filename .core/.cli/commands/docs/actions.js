const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const { createDoc } = require('apidoc');
const globby = require('globby');

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        create: async ({ action, params, props }) => {
            message(`Creating ${chalk.cyan('docs')}...`);

            let { src, dest, verbose } = params;

            src = _.flatten(
                src.map(search => {
                    if (search === 'node_modules/@atomic-reactor') {
                        const globRoot = path
                            .resolve(process.cwd(), search)
                            .replace(/\\/g, '/');

                        const globs = [
                            `${globRoot}/**/src/*.js`,
                            `${globRoot}/**/lib/*.js`,
                            `!${globRoot}/**/node_modules/**/*`,
                            `!${globRoot}/cli/**/*`,
                        ];

                        return _.uniq(
                            globby
                                .sync(globs)
                                .map(fn =>
                                    path.dirname(fn).replace(globRoot, ''),
                                ),
                        ).map(p => `${search}${p}`);
                    }
                    return search;
                }),
            );

            dest = String(dest)
                .replace(/ /gi, '')
                .split(',');
            dest = _.flatten([dest]);

            dest.forEach(d => {
                createDoc({
                    src,
                    dest: d,
                    lineEnding: '\n',
                    debug: verbose,
                    verbose,
                });
            });

            return Promise.resolve({ action, status: 200 });
        },
    };
};
