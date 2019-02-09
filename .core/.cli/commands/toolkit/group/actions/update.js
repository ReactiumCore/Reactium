const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const op = require('object-path');
const prettier = require('prettier').format;
const handlebars = require('handlebars').compile;

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    const now = Date.now();

    return {
        backupManifest: ({ action, params, props }) => {
            const { cwd } = props;

            message(`backing up toolkit manifest...`);

            // Backup the ~/src/app/toolkit/index.js file
            const backupDir = path.normalize(`${cwd}/.BACKUP/toolkit`);
            const backupIndex = path.normalize(`${backupDir}/${now}.index.js`);
            const index = path.normalize(`${cwd}/src/app/toolkit/index.js`);

            fs.ensureDirSync(backupDir);

            return new Promise((resolve, reject) => {
                fs.copy(index, backupIndex, error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ action, status: 200 });
                    }
                });
            });
        },

        manifest: ({ action, params, props }) => {
            const { cwd } = props;
            const { group, id, menuOrder, newid } = params;

            const manifest = require('../../manifest')(props);
            const index = path.normalize(`${cwd}/src/app/toolkit/index.js`);

            op.del(manifest, `menu.${id}`);

            if (!isNaN(menuOrder)) {
                const keys = Object.keys(op.get(manifest, `menu`, {})).filter(
                    key => {
                        return key !== id;
                    },
                );
                keys.splice(menuOrder, 0, newid);

                const groups = keys.reduce((obj, key) => {
                    obj[key] = op.get(manifest, `menu.${key}`, {});
                    return obj;
                }, {});

                op.set(manifest, `menu`, groups);
            }

            const keys = ['route', 'dna', 'component', 'readme'];
            const regex = new RegExp(`\/${id}\/`, 'gi');

            group.elements = Object.keys(group.elements).reduce(
                (obj, element) => {
                    obj[element] = { ...group.elements[element] };
                    keys.forEach(key => {
                        let val = op.get(obj[element], key);
                        if (val) {
                            val = String(val).replace(regex, `/${newid}/`);
                            obj[element][key] = val;
                        }
                    });
                    return obj;
                },
                {},
            );

            op.set(manifest, `menu.${newid}`, group);

            let content = String(
                prettier(JSON.stringify(manifest), {
                    parser: 'json-stringify',
                }),
            )
                .replace(/\"require(.*?)\.default\"/gim, 'require$1.default')
                .replace(/\\"/g, '"')
                .replace(/\\'/g, "'");

            content = prettier(`module.exports = ${content};`, {
                parser: 'babel',
                printWidth: 240,
                singleQuote: true,
                tabWidth: 4,
                trailingComma: 'all',
            });

            return new Promise((resolve, reject) => {
                fs.writeFile(index, content, error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ action, status: 200 });
                    }
                });
            });
        },

        rename: ({ action, params, props }) => {
            const { cwd } = props;
            const { id, newid } = params;
            const curr = path.normalize(`${cwd}/src/app/toolkit/${id}`);
            const dest = path.normalize(`${cwd}/src/app/toolkit/${newid}`);

            fs.ensureDirSync(dest);

            return new Promise((resolve, reject) => {
                fs.move(curr, dest, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ action, status: 200 });
                    }
                });
            });
        },
    };
};
