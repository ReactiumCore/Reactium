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

    const generate = ({ action, params, props, templateFile, fileName }) => {
        const { cwd } = props;
        const { destination, name, overwrite } = params;

        const filepath = path.normalize(path.join(destination, fileName));

        const actionType = overwrite === true ? 'overwritting' : 'creating';

        message(`${actionType} ${chalk.cyan(name)} ${fileName}...`);

        fs.ensureDirSync(path.normalize(destination));

        // Template content
        const template = path.normalize(
            `${__dirname}/template/${templateFile}.hbs`,
        );
        const content = handlebars(fs.readFileSync(template, 'utf-8'))(params);

        return new Promise((resolve, reject) => {
            fs.writeFile(filepath, content, error => {
                if (error) {
                    reject(error.Error);
                } else {
                    resolve({ action, status: 200 });
                }
            });
        });
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

        element: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'component',
                fileName: 'index.js',
            }),

        readme: ({ action, params, props }) =>
            generate({
                action,
                params,
                props,
                templateFile: 'readme',
                fileName: 'readme.js',
            }),

        manifest: ({ action, params, props }) => {
            const { cwd } = props;
            const { element, group, ID, menuOrder } = params;

            const manifest = require('../../manifest')(props);
            const index = path.normalize(`${cwd}/src/app/toolkit/index.js`);

            if (!isNaN(menuOrder)) {
                const elements = {};

                let keys = Object.keys(
                    op.get(manifest, `menu.${group}.elements`, {}),
                ).filter(key => {
                    return key !== ID;
                });

                keys.splice(menuOrder, 0, ID);
                keys.forEach(key => {
                    elements[key] = op.get(
                        manifest,
                        `menu.${group}.elements.${key}`,
                        {},
                    );
                });

                op.set(manifest, `menu.${group}.elements`, elements);
            }

            op.set(manifest, `menu.${group}.elements.${ID}`, element);

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
