const fs = require('fs-extra');
const path = require('path');
const op = require('object-path');
const prettier = require('prettier');
const chalk = require('chalk');
const homedir = require('os').homedir();
const handlebars = require('handlebars').compile;
const uuid = require('uuid/v4');

module.exports = spinner => {
    const message = text => {
        if (spinner) {
            spinner.text = text;
        }
    };

    return {
        backup: ({ action, params, props }) => {
            const { filename, filepath, overwrite } = params;
            const { cwd, root } = props;

            return new Promise((resolve, reject) => {
                if (overwrite !== true) {
                    resolve({ action, status: 200 });
                    return;
                }

                message(`backing up ${chalk.cyan(filename)}...`);

                const now = Date.now();
                const dir = path.join(
                    homedir,
                    '.arcli',
                    cwd,
                    '.BACKUP',
                    'style',
                );
                const backup = path.normalize(`${dir}/${now}.${filename}`);

                // Create the backup directory
                fs.ensureDirSync(dir);

                // Copy
                fs.copy(path.normalize(filepath), backup, error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ action, status: 200 });
                    }
                });
            });
        },

        create: ({ action, params }) => {
            const { destination, filename, filepath, overwrite } = params;

            const actionType = overwrite === true ? 'overwritting' : 'creating';

            message(`${actionType} stylesheet ${chalk.cyan(filename)}...`);

            fs.ensureDirSync(path.normalize(destination));

            // Template content
            const template = path.normalize(`${__dirname}/template/style.hbs`);
            const content = handlebars(fs.readFileSync(template, 'utf-8'))(
                params,
            );

            return new Promise((resolve, reject) => {
                fs.writeFile(filepath, content, error => {
                    if (error) {
                        reject(error.Error);
                    } else {
                        resolve({ action, status: 200 });
                    }
                });
            });
        },

        partialOrder: async ({ action, params }) => {
            const { destination, filename, filepath, overwrite } = params;

            message(`reactium-gulp for ${chalk.cyan(filename)}...`);

            fs.ensureDirSync(path.normalize(destination));
            const baseDir = path.basename(destination);
            const reactumGulp = path.resolve(destination, 'reactium-gulp.js');

            // Template content
            const template = path.normalize(
                `${__dirname}/template/reactium-gulp.hbs`,
            );
            const content = handlebars(fs.readFileSync(template, 'utf-8'))({
                ...params,
                id: uuid(),
                pattern: `/${baseDir}\\/${filename.replace('.scss', '')}/`,
            });

            return new Promise((resolve, reject) => {
                fs.writeFile(reactumGulp, content, error => {
                    if (error) {
                        reject(error.Error);
                    } else {
                        resolve({ action, status: 200 });
                    }
                });
            });
        },
    };
};
