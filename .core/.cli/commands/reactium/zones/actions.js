const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const prettier = require('prettier');
const globby = require('globby');

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    const results = { scan: {} };

    const scan = ({ action, params, props }) => {
        message(
            `Scanning for plugin ${chalk.cyan(
                'zones',
            )}. This may take awhile...`,
        );

        const { cwd = process.cwd() } = props;
        const globs = [];

        if (op.get(params, 'source') === true) {
            globs.push(path.normalize(`${cwd}/src/**/*.js*`));
        }

        if (op.get(params, 'node') === true) {
            globs.push(path.normalize(`${cwd}/node_modules/**/*.js*`));
        }

        if (globs.length < 1) {
            return { action, status: 200, zones: {} };
        }

        const quick_scan = /\<Plugins/;

        const M = require('./manifest')();

        return globby(globs).then(files => {
            const zones = files.reduce((z, file) => {
                const contents = fs.readFileSync(file);
                if (!quick_scan.test(contents)) {
                    return z;
                }

                const reg_find = /<Plugins[\s\S](.*?)[\s\S]\/>/g;
                const match = reg_find.exec(
                    String(fs.readFileSync(file)).replace(/["'\s+]/g, ' '),
                );

                if (match) {
                    const zone = String(match[0]).match(/zone= (.*?) /i);
                    if (Array.isArray(zone) && zone.length > 1) {
                        const id = zone[1];
                        if (op.has(M, id)) {
                            return z;
                        }

                        z[id] = {
                            description: `Plugin zone found in: ${file.replace(
                                path.normalize(cwd),
                                '',
                            )}`,
                        };
                    }
                }

                return z;
            }, {});

            if (action) {
                results[action] = { ...zones, ...M };
            }

            return { action, status: 200, zones };
        });
    };

    const cache = ({ action, params, props }) => {
        message(`Caching plugin ${chalk.cyan('zones')}...`);

        const { cwd = process.cwd() } = props;
        const cont = prettier.format(JSON.stringify(results.scan), {
            parser: 'json-stringify',
        });

        const filePath = path.normalize(`${cwd}/.cli-cache/plugin-zones.json`);
        fs.ensureFileSync(filePath);
        fs.writeFileSync(filePath, cont);

        return Promise.resolve({ action, status: 200 });
    };

    return {
        scan,
        cache,
    };
};
