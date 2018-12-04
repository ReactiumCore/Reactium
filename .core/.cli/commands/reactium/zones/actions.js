const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const prettier = require('prettier');
const globby = require('globby');

const mod = path.dirname(require.main.filename);
const pad = require(`${mod}/lib/pad`);

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    const M = require('./manifest')();

    const results = { action: 'result', zones: { ...M }, status: 200 };

    const zoneList = () =>
        Object.keys(M)
            .map((zone, index) => {
                index += 1;
                const len = String(Object.keys(M).length).length;
                const i = chalk.cyan(pad(index, len) + '.');
                return `   ${i} ${zone}`;
            })
            .join('\n');

    const list = ({ action, params, props }) => {
        const l = zoneList();

        if (l.length > 0) {
            console.log(chalk.cyan(' Zones:'));
            console.log(zoneList());
        } else {
            console.log(
                ` ${chalk.red('No zones found!')}\n\n   Run:\n${chalk.cyan(
                    '   $ arcli zones scan',
                )}\n\n   or:\n${chalk.cyan('   $ arcli zones add')}`,
            );
        }
        return Promise.resolve({ action, status: 200 });
    };

    const object = ({ action, params, props }) => {
        console.log(
            '\n',
            prettier
                .format(JSON.stringify(results.zones), {
                    parser: 'json-stringify',
                })
                .replace(/\"(.*?)\": \{/g, `"${chalk.cyan('$1')}": {`)
                .replace(/\"(.*?)\": \"/g, `"${chalk.green('$1')}": "`)
                .replace(/\n/g, `\n `),
        );

        return Promise.resolve({ action, status: 200 });
    };

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
            return Promise.resolve({ action, status: 200 });
        }

        const quick_scan = /\<Plugins/;

        return globby(globs).then(files => {
            const zones = files.reduce((z, file) => {
                const contents = fs.readFileSync(file);
                if (!quick_scan.test(contents)) {
                    return z;
                }

                const reg_find = /<Plugins[\s\S](.*?)[\s\S]\/>/gm;
                const matches = String(fs.readFileSync(file))
                    .replace(/["'\s+]/g, ' ')
                    .match(reg_find);

                if (matches) {
                    matches.forEach(match => {
                        const zone = String(match).match(/zone= (.*?) /i);
                        if (Array.isArray(zone) && zone.length > 1) {
                            const id = zone[1];
                            if (op.has(M, id)) {
                                return z;
                            }

                            z[id] = {
                                file,
                                description: `Plugin zone found in: ${file.replace(
                                    path.normalize(cwd),
                                    '',
                                )}`,
                            };
                        }
                    });
                }

                return z;
            }, {});

            if (action) {
                results['zones'] = { ...zones, ...M };
            }

            return { action, status: 200 };
        });
    };

    const create = ({ action, params, props }) => {
        const { description, id } = params;

        results.zones = { ...M };
        results.zones[id] = { description };

        return Promise.resolve({ action, status: 200 });
    };

    const remove = ({ action, params, props }) => {
        const { id } = params;

        delete results.zones[id];

        return Promise.resolve({ action, status: 200 });
    };

    const purge = ({ action, params, props }) => {
        results.zones = {};
        return Promise.resolve({ action, status: 200 });
    };

    const cache = ({ action, params, props }) => {
        message(`Caching plugin ${chalk.cyan('zones')}...`);

        const { cwd = process.cwd() } = props;
        const cont = prettier.format(JSON.stringify(results.zones), {
            parser: 'json-stringify',
        });

        const filePath = path.normalize(`${cwd}/.cli-cache/plugin-zones.json`);
        fs.ensureFileSync(filePath);
        fs.writeFileSync(filePath, cont);

        return Promise.resolve({ action, status: 200 });
    };

    const result = () => Promise.resolve(results);

    return {
        list,
        object,
        scan,
        create,
        purge,
        cache,
        remove,
        result,
    };
};
