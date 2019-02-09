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
            const { group, id, menuOrder } = params;

            const manifest = require('../../manifest')(props);
            const index = path.normalize(`${cwd}/src/app/toolkit/index.js`);

            if (!isNaN(menuOrder)) {
                const keys = Object.keys(op.get(manifest, `menu`, {})).filter(
                    key => {
                        return key !== id;
                    },
                );
                keys.splice(menuOrder, 0, id);

                const groups = keys.reduce((obj, key) => {
                    obj[key] = op.get(manifest, `menu.${key}`, {});
                    return obj;
                }, {});

                op.set(manifest, `menu`, groups);
            }

            op.set(manifest, `menu.${id}`, group);

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
    };
};
