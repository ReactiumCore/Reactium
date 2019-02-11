const now = Date.now();
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const op = require('object-path');
const zip = require('folder-zipper');
const prettier = require('prettier').format;
const handlebars = require('handlebars').compile;

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
            const { cwd } = props;
            const { destination, group, name } = params;

            message(`backing up ${name} element...`);

            const backupDir = backupPath(cwd);
            const backupZip = path.normalize(
                `${backupDir}/${now}.${group}.${name}.zip`,
            );

            // Create the backup directory
            fs.ensureDirSync(backupDir);

            // Backup the component directory then empty the existing
            return zip(destination, backupZip).then(() => {
                fs.emptyDirSync(destination);
                return { action, status: 200 };
            });
        },

        backupManifest: ({ action, params, props }) => {
            const { cwd } = props;
            const { destination, group, name } = params;

            message(`backing up toolkit manifest...`);

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
            const { cwd } = props;
            const { key } = params;

            const manifest = require('../../manifest')(props);
            const index = path.normalize(`${cwd}/src/app/toolkit/index.js`);

            message(`updating toolkit manifest...`);

            op.del(manifest, key);

            let content = String(
                prettier(JSON.stringify(manifest), {
                    parser: 'json-stringify',
                }),
            ).replace(/\"require(.*?)\.default\"/gim, 'require$1.default');

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

        remove: ({ action, params, props }) => {
            const { cwd } = props;
            const { destination, name } = params;

            message(`removing ${name} element...`);

            return new Promise((resolve, reject) => {
                fs.remove(destination, error => {
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
