const now = Date.now();
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const op = require('object-path');
const _ = require('underscore');
const prettier = require('prettier').format;

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    const backupPath = cwd => {
        return path.normalize(`${cwd}/.BACKUP/toolkit`);
    };

    return {
        backup: ({ action, params, props }) => {
            message(`backing up toolkit manifest...`);

            const { cwd } = props;

            // Backup the ~/src/app/toolkit/index.js file
            const backupDir = backupPath(cwd);
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
            message(`updating manifest...`);

            const { cwd } = props;
            const { name } = params;

            const indexFile = path.normalize(`${cwd}/src/app/toolkit/index.js`);
            const manifest = require('../../manifest')(props);

            const themes = op.get(manifest, 'themes', []);
            const index = _.findIndex(themes, { name });

            if (index > -1) {
                themes.splice(index, 1);
                manifest.themes = themes;
            } else {
                resolve({ action, status: 200 });
                return;
            }

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
                fs.writeFile(indexFile, content, error => {
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
