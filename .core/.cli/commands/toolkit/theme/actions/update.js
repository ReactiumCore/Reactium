const now = Date.now();
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const op = require('object-path');
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
            const {
                menuOrder = null,
                name,
                newName,
                selected = false,
            } = params;

            let theme = { ...params };
            theme.name = newName;

            delete theme.menuOrder;
            delete theme.newName;

            const indexFile = path.normalize(`${cwd}/src/app/toolkit/index.js`);
            const manifest = require('../../manifest')(props);

            let currentIndex = -1;
            const themes = op.get(manifest, 'themes', []).map((item, i) => {
                if (selected === true) {
                    delete item.selected;
                }

                if (item.name === name) {
                    currentIndex = i;
                }

                return item;
            });

            if (currentIndex !== -1) {
                themes.splice(currentIndex, 1);
            }

            if (!isNaN(menuOrder)) {
                themes.splice(menuOrder, 0, theme);
            } else {
                themes.push(theme);
            }

            manifest.themes = themes;

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
